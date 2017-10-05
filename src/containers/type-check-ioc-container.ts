import { InvalidDeclaration, MissingConfig } from '../error-types';
import { Declaration, InstanceConstructor } from '../types';
import getRegisteredServiceInfo from '../utils/get-registered-service-info';
import { IoCContainer } from './ioc-container';

export interface RegisteredInterfaces {
    [id: string]: Function;
}

export class TypeCheckIoCContainer extends IoCContainer {
    constructor(private registeredInterfaces: RegisteredInterfaces) {
        super();
        if (!registeredInterfaces) {
            throw new MissingConfig();
        }
    }

    public register(id: string, declaration: Declaration<any>) {
        const interfaceToRegister = this.registeredInterfaces[id];
        if (!interfaceToRegister) {
            throw new InvalidDeclaration(id, 'YOU MUST DECLARE AN INTERFACE FOR EACH SERVICE ' +
                'BEFORE REGISTERING AN IMPLEMENTAION');
        }
        const { constructor, dependencies, isSingleton } = getRegisteredServiceInfo(id, declaration);
        if (!((constructor as InstanceConstructor<any>).prototype instanceof interfaceToRegister)) {
            throw new InvalidDeclaration(id, 'INTERFACE MISMATCH - YOU MUST EXTEND THE DECLARED ' +
                'INTERFACE IN YOUR IMPLEMENTATION');
        }
        this.registeredServices[id] = { constructor, dependencies, isSingleton };
        return {
            asSingleton: () => this.registeredServices[id].isSingleton = true
        };
    }
}
