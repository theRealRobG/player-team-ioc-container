// tslint:disable
import { TypeCheckIoCContainer } from '../../src';

export default (appContainerDiv: HTMLDivElement) => {
    function log(...messages: any[]) {
        const message = messages.length > 0 && messages.reduce((previousMessage, nextMessage) => previousMessage += ` - ${nextMessage}`);
        if (message) {
            const messageElement = document.createElement('p');
            messageElement.innerText = message;
            appContainerDiv.appendChild(messageElement);
        }
    }
    abstract class ITest {
        abstract jam: string;
        abstract test(): void;
    }
    abstract class IRobot {
        abstract speak(message: string): void;
        abstract testJam(): void;
        abstract getJam(): string;
    }
    abstract class IPod {
        abstract youChoose(choice: boolean): void;
    }
    const config = {
        test: ITest,
        robot: IRobot,
        pod: IPod
    };
    const container = new TypeCheckIoCContainer(config);

    @container.provides<ITest>('test', ITest.prototype)
    class Test {
        jam = 'jam';
        test() {
            log(this.jam);
        }
    }
    @container.provides<IRobot>('robot', IRobot.prototype)
    class Robot {
        constructor(private test: ITest) {}
        speak(message: string) {
            log(message);
        }
        testJam() {
            this.speak(this.getJam());
        }
        getJam() {
            return this.test.jam;
        }
    }
    @container.provides<IPod>('pod', IPod.prototype)
    class Pod {
        constructor(private test: ITest, private robot: IRobot) {}

        youChoose(choice: boolean) {
            choice ? this.test.test() : this.robot.speak(`you chose ${this.robot.getJam()}`);
        }
    }

    const test = container.get<ITest>('test');
    const robot = container.get<IRobot>('robot');
    const pod = container.get<IPod>('pod');

    test.test();
    robot.speak('amazing experiences');
    robot.testJam();
    robot.speak(robot.getJam());
    pod.youChoose(true);
    pod.youChoose(false);
}
