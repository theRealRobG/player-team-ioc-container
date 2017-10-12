import { InvalidConfig, InvalidDeclaration, MissingConfig } from '../error-types';
import getParamNames from '../utils/get-param-names';
import getRegisteredServiceInfo from '../utils/get-registered-service-info';
import isConstructable from '../utils/is-constructable';
import BaseContainer from './base-container';

export interface RegisteredInterfaces {
    [id: string]: Function;
}
export interface Constructor<T> {
    new(...args: any[]): T;
}

export default class extends BaseContainer {
    constructor(private registeredInterfaces: RegisteredInterfaces) {
        super();
        if (!registeredInterfaces) {
            throw new MissingConfig();
        }
        Object.keys(registeredInterfaces).forEach((id) => {
            if (!isConstructable(registeredInterfaces[id])) {
                throw new InvalidConfig(id, registeredInterfaces[id]);
            }
        });
    }

    public get<T>(id: string) {
        return this.resolveWithDependencyChain<T>(id, []);
    }

    public provides<T>(id: string, interfacePrototypeForImpl: T) {
        return this.register(id, interfacePrototypeForImpl, false);
    }

    public singleton<T>(id: string, interfacePrototypeForImpl: T) {
        return this.register(id, interfacePrototypeForImpl, true);
    }

    private register<T>(id: string, interfacePrototypeForImpl: T, isSingleton: boolean) {
        const registeredInterface = this.registeredInterfaces[id];
        this.validateRegistration(id, registeredInterface, interfacePrototypeForImpl);
        return (implementation: Constructor<T>) => {
            const { constructor, dependencies } = getRegisteredServiceInfo(id, implementation, getParamNames);
            if (!isConstructable(constructor)) {
                const message = 'The registered function must be constructable (can be called with new)';
                throw new InvalidDeclaration(id, message);
            }
            this.registeredServices[id] = { constructor, dependencies, isSingleton };
        };
    }

    private validateRegistration<T>(id: string, registeredInterface: Function, interfacePrototypeForImpl: T) {
        if (interfacePrototypeForImpl.constructor.name === 'Object') {
            throw new InvalidDeclaration(id, 'The registered interface must have a named constructor');
        }
        if (!registeredInterface) {
            throw new InvalidDeclaration(id, 'You must declare an interface for each service ' +
                'before registering an implementation');
        }
        if (registeredInterface.prototype !== interfacePrototypeForImpl) {
            throw new InvalidDeclaration(id, 'INTERFACE MISMATCH - Trying to declare an implementation of ' +
                `"${interfacePrototypeForImpl.constructor.name}"` +
                ` against "${id}" but "${id}" expects an implementation of ` +
                `"${registeredInterface.prototype.constructor.name}"`);
        }
    }
}
