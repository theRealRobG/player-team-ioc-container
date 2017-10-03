// tslint:disable
import { IoCContainer } from '../src/index';

const AppContainerDiv = document.getElementById('app') as HTMLDivElement;
const testP = document.createElement('p');
testP.innerText = 'Rob is awesome';
AppContainerDiv.appendChild(testP);

class A {
    constructor(private ServiceB: B, private ServiceC: C) {
        const anotherP = document.createElement('p');
        anotherP.innerText = 'ServiceA has been initialised';
        AppContainerDiv.appendChild(anotherP);
    }

    public test(message: string) {
        this.ServiceB.appendText(message);
    }

    public anotherTest(message: string) {
        this.ServiceC.test(message);
    }
}

class B {
    appendText(message: string) {
        const anotherP = document.createElement('p');
        anotherP.innerText = message;
        AppContainerDiv.appendChild(anotherP);
    }
}

class C {
    constructor(private randomNameThatIsActuallyB: B) {}

    public test(message: string) {
        this.randomNameThatIsActuallyB.appendText(message);
    }
}

const container = new IoCContainer();
container.register('ServiceA', A);
container.register('ServiceB', B);
container.register('ServiceC', ['ServiceB', C]);
const serviceA = container.resolve<A>('ServiceA');

serviceA.test('Amazing experiences!');
serviceA.anotherTest('Seriously, Rob is so awesome');

const serviceC = container.resolve<C>('ServiceC');
serviceC.test('This is so cool!');
