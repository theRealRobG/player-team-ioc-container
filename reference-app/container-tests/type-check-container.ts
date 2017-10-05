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

    class Test extends ITest {
        jam = 'jam';
        test() {
            log(this.jam);
        }
    }
    class Robot extends IRobot {
        constructor(private test: ITest) {
            super();
        }
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
    class Pod extends IPod {
        constructor(private oneTest: ITest, private somethingElse: IRobot) {
            super();
        }

        youChoose(choice: boolean) {
            choice ? this.oneTest.test() : this.somethingElse.speak(`you chose ${this.somethingElse.getJam()}`);
        }
    }

    const container = new TypeCheckIoCContainer(config);

    container.register('test', Test);
    container.register('robot', Robot);
    container.register('pod', ['test', 'robot', Pod]);

    const test = container.resolve<ITest>('test');
    const robot = container.resolve<IRobot>('robot');
    const pod = container.resolve<IPod>('pod');

    test.test();
    robot.speak('amazing experiences');
    robot.testJam();
    robot.speak(robot.getJam());
    pod.youChoose(true);
    pod.youChoose(false);
}
