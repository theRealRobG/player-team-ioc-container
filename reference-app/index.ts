// tslint:disable
import { IoCContainer } from '../src/index';

const AppContainerDiv = document.getElementById('app') as HTMLDivElement;
const testP = document.createElement('p');
testP.innerText = 'Rob is awesome';
AppContainerDiv.appendChild(testP);

class A {
    constructor(ServiceB: B) {
        const anotherP = document.createElement('p');
        anotherP.innerText = 'will this work?';
        AppContainerDiv.appendChild(anotherP);
    }
}

class B {
    constructor() {
        const anotherP = document.createElement('p');
        anotherP.innerText = 'jam is sweet';
        AppContainerDiv.appendChild(anotherP);
    }
}

const container = new IoCContainer();
container.register('ServiceA', A);
container.register('ServiceB', B);
container.resolve('ServiceA');
