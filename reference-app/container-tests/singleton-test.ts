// tslint:disable
import { IoCContainer } from '../../src';

export default (appContainerDiv: HTMLDivElement) => {
    function log(...messages: any[]) {
        const message = messages.length > 0 && messages.reduce((previousMessage, nextMessage) => previousMessage += ` - ${nextMessage}`);
        if (message) {
            const messageElement = document.createElement('p');
            messageElement.innerText = message;
            appContainerDiv.appendChild(messageElement);
            return {
                color: (color: string) => {
                    messageElement.style.color = color;
                }
            }
        }
        return { color: (color: string) => undefined };
    }
    class SingletonTest {
        name = 'bob';
        setName(newName: string) {
            this.name = newName;
        }
    }
    class Dependee {
        constructor(private bob: SingletonTest) {}
        getName() {
            return this.bob.name;
        }
        logName() {
            log(this.bob.name);
        }
        changeName(newName: string) {
            this.bob.setName(newName);
        }
    }

    const container = new IoCContainer();
    container.register('bob', SingletonTest);
    container.register('singleBob', SingletonTest).asSingleton();
    container.register('jim', Dependee);
    container.register('singleJim', ['singleBob', Dependee]);
    container.register('reg', Dependee);
    container.register('singleReg', ['singleBob', Dependee]);

    const jim = container.resolve<Dependee>('jim');
    const reg = container.resolve<Dependee>('reg');
    const singleJim = container.resolve<Dependee>('singleJim');
    const singleReg = container.resolve<Dependee>('singleReg');

    log('Start of non-singleton test');
    jim.logName();
    reg.logName();
    reg.changeName('something new');
    jim.logName();
    reg.logName();
    const nonSingletonSuccess = jim.getName() !== reg.getName();
    log('Test result', nonSingletonSuccess ? 'Success!' : 'Failure')
        .color(nonSingletonSuccess ? 'green' : 'red');
    log('End');

    log('Start of singleton test');
    singleJim.logName();
    singleReg.logName();
    singleReg.changeName('something new');
    singleJim.logName();
    singleReg.logName();
    const singletonSuccess = singleJim.getName() === singleReg.getName();
    log('Test result', singletonSuccess ? 'Success!' : 'Failure')
        .color(singletonSuccess ? 'green' : 'red');
    log('End');
}
