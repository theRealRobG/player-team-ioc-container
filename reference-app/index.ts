// tslint:disable
import { IoCContainer } from '../src/index';

const AppContainerDiv = document.getElementById('app') as HTMLDivElement;
if (AppContainerDiv) {
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
        constructor(private randomNameThatIsActuallyB: B, someD: D) {}

        public test(message: string) {
            this.randomNameThatIsActuallyB.appendText(message);
        }
    }

    class D {
        constructor(ServiceB: any) {}
    }

    const container = new IoCContainer();
    container.register('ServiceA', A);
    container.register('ServiceB', B);
    container.register('ServiceC', ['ServiceB', 'ServiceD', C]);
    container.register('ServiceD', D);
    const serviceA = container.resolve<A>('ServiceA');

    serviceA.test('Amazing experiences!');
    serviceA.anotherTest('Seriously, Rob is so awesome');

    const serviceC = container.resolve<C>('ServiceC');
    serviceC.test('This is so cool!');

    container.register('ServiceAnon', ['ServiceC', (minifiedC: C) => minifiedC.test('Anonymous jam')]);
    container.resolve<void>('ServiceAnon');

    container.register('Jam', () => ({ jam: 'Jam is sweet' }));
    const jam = container.resolve<{ jam: string }>('Jam');
    serviceA.anotherTest(jam.jam);
}
