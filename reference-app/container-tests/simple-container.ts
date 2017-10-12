// tslint:disable
import { SimpleIoCContainer } from '../../src'

export default (appContainerDiv: HTMLDivElement) => {
    class A {
        constructor(private ServiceB: B, private ServiceC: C) {
            const anotherP = document.createElement('p');
            anotherP.innerText = 'ServiceA has been initialised';
            appContainerDiv.appendChild(anotherP);
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
            appContainerDiv.appendChild(anotherP);
        }
    }

    class C {
        constructor(private randomNameThatIsActuallyB: B, someD: D) {}

        public test(message: string) {
            this.randomNameThatIsActuallyB.appendText(message);
        }
    }

    class D {
        constructor(ServiceB: any) {}
    }

    const container = new SimpleIoCContainer();
    container.register('ServiceA', A);
    container.register('ServiceB', B);
    container.register('ServiceC', ['ServiceB', 'ServiceD', C]);
    container.register('ServiceD', D);
    const serviceA = container.resolve<A>('ServiceA');

    serviceA.test('Amazing experiences!');
    serviceA.anotherTest('Seriously, Rob is so awesome');

    const serviceC = container.resolve<C>('ServiceC');
    serviceC.test('This is so cool!');
}