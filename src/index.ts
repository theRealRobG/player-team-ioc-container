import {
    CircularDependency,
    DependencyConstructionFailure,
    InvalidDeclaration,
    UnregisteredDependency
} from './error-types';
import getParamNames from './utils/get-param-names';
import isConstructable from './utils/is-constructable';

export interface RegisteredService<T> {
    constructor: Function;
    dependencies: string[];
    instance?: T;
}

export type FunctionDeclaration = Function | FunctionConstructor;
export type ArrayDeclaration = Array<string | FunctionDeclaration>;
export type Declaration = FunctionDeclaration | ArrayDeclaration;

function getRegisteredServiceInfo(declaration: Declaration): RegisteredService<any> {
    if (typeof declaration === 'function') {
        return {
            constructor: declaration,
            dependencies: getParamNames(declaration)
        };
    } else if (Array.isArray(declaration)) {
        return {
            constructor: declaration.slice(-1)[0] as FunctionDeclaration,
            dependencies: declaration.slice(0, -1) as string[]
        };
    } else {
        throw new InvalidDeclaration();
    }
}

export class IoCContainer {
    private registeredServices: { [id: string]: RegisteredService<any> } = {};

    public resolve(id: string, dependencyChain: string[] = []) {
        const registeredService = this.registeredServices[id];
        if (!registeredService) {
            throw new UnregisteredDependency(id);
        }
        if (registeredService.instance) {
            return registeredService.instance;
        }
        if (registeredService.dependencies.length === 0) {
            try {
                let instance: any;
                if (isConstructable(registeredService.constructor)) {
                    instance = new registeredService.constructor();
                } else {
                    instance = registeredService.constructor();
                }
                registeredService.instance = instance;
                return instance;
            } catch (e) {
                throw new DependencyConstructionFailure(id);
            }
        }
        if (dependencyChain.indexOf(id) !== -1) {
            throw new CircularDependency(dependencyChain, id);
        }
        registeredService.dependencies.forEach((dependency) => {
            this.resolve(dependency, dependencyChain.concat([id]));
        });
    }

    public register(id: string, declaration: Declaration) {
        const { constructor, dependencies } = getRegisteredServiceInfo(declaration);
        this.registeredServices[id] = {
            constructor,
            dependencies
        };
    }
}
