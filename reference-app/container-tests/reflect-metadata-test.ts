// tslint:disable
import { get, provides, singleton } from '../../src'

export default (appContainerDiv: HTMLDivElement) => {
    function log(...messages: any[]) {
        const message = messages.length > 0 && messages.reduce((previousMessage, nextMessage) => previousMessage += ` - ${nextMessage}`);
        const messageElement = document.createElement('p');
        if (message) {
            messageElement.innerText = message;
            appContainerDiv.appendChild(messageElement);
        }
        return messageElement;
    }

    // #region interfaces

    abstract class IPhone {
        abstract call(name: string): void;
        abstract ring(): void;
        abstract displayTime(): void;
    }
    abstract class IPad extends IPhone {
        abstract watchVideo(): void;
    }
    abstract class IAntenna {
        abstract makeCall(name: string): void;
    }
    abstract class ISpeaker {
        abstract makeRing(): void;
    }
    abstract class IWatch {
        abstract displayTime(): void;
        abstract getTime(): number;
    }
    abstract class IVideo {
        abstract startVideo(): void;
    }
    abstract class IClock {
        abstract getTime(): number;
        abstract setTime(time: number): void;
    }

    // #endregion
    // #region implementations

    @singleton(IClock)
    class Clock {
        private time = 0;
        public getTime() {
            return this.time;
        }
        public setTime(time: number) {
            this.time = time;
        }
    }

    @provides(IWatch)
    class Watch {
        constructor(private clock: IClock) {}
        public displayTime() {
            log(`The watch says that the time is ${this.clock.getTime()}`)
        }
        public getTime() {
            return this.clock.getTime();
        }
    }

    @provides(ISpeaker)
    class Speaker {
        public makeRing() {
            log('Ring!', 'Ring!', 'Someone is ringing!').style.color = 'red';
        }
    }

    @provides(IAntenna)
    class Antenna {
        public makeCall(name: string) {
            log(`About to ring ${name}`, `Ringing ${name}`, `${name}, are you there?`);
        }
    }

    @provides(IVideo)
    class Video {
        public startVideo() {
            log('Watching some cool vids!');
        }
    }

    @provides(IPad)
    class Pad {
        constructor(
            private videoPlayer: IVideo,
            private antenna: IAntenna,
            private speaker: ISpeaker,
            private clock: IClock
        ) {}
        public watchVideo() {
            this.videoPlayer.startVideo();
        }
        public call(name: string) {
            this.antenna.makeCall(name);
        }
        public ring() {
            this.speaker.makeRing();
        }
        public displayTime() {
            log(`Pad says the time is ${this.clock.getTime()}`);
        }
    }

    @provides(IPhone)
    class Phone {
        constructor(
            private antenna: IAntenna,
            private speaker: ISpeaker,
            private watch: IWatch
        ) {}
        public call(name: string) {
            this.antenna.makeCall(name);
        }
        public ring() {
            this.speaker.makeRing();
        }
        public displayTime() {
            log(`Phone gets the time from watch and says it is ${this.watch.getTime()}`);
        }
    }

    // #endregion
    // #region tests

    const phone = get(IPhone);
    const pad = get(IPad);
    const watch = get(IWatch);
    const universalTime = get(IClock);

    log('Phone tests').style.fontWeight = 'bold';
    phone.call('Bill');
    phone.ring();
    phone.displayTime();

    log('Setting time to 5').style.fontStyle = 'italic';
    universalTime.setTime(5);

    log('Pad tests').style.fontWeight = 'bold';
    pad.call('Dave');
    pad.ring();
    pad.watchVideo();
    pad.displayTime();

    log('Setting time to 22').style.fontStyle = 'italic';
    universalTime.setTime(22);

    log('Watch tests').style.fontWeight = 'bold';
    watch.displayTime();

    log('Setting time to 1337').style.fontStyle = 'italic';
    universalTime.setTime(1337);

    log('Checking time on all devices').style.fontWeight = 'bold';
    phone.displayTime();
    pad.displayTime();
    watch.displayTime();

    // #endregion
}
