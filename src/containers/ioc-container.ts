import { CircularDependency, UnregisteredDependency } from '../error-types';
import { Declaration, RegisteredService } from '../types';

import getInstanceWithDependencies from '../utils/get-instance-with-dependencies';
import getRegisteredServiceInfo from '../utils/get-registered-service-info';

export class IoCContainer {
    protected registeredServices: { [id: string]: RegisteredService<any> } = {};

    public resolve<T>(id: string): T {
        return this.resolveWithDependencyChain<T>(id, []);
    }

    public register(id: string, declaration: Declaration<any>) {
        this.registeredServices[id] = getRegisteredServiceInfo(id, declaration);
        return {
            asSingleton: () => this.registeredServices[id].isSingleton = true
        };
    }

    protected resolveWithDependencyChain<T>(id: string, dependencyChain: string[]): T {
        const registeredService = this.registeredServices[id] as RegisteredService<T>;
        let instance: T;
        if (!registeredService) {
            throw new UnregisteredDependency(id, dependencyChain);
        } else if (registeredService.instance) {
            instance = registeredService.instance;
        } else if (registeredService.dependencies.length === 0) {
            instance = getInstanceWithDependencies<T>(id, registeredService.constructor, []);
        } else if (dependencyChain.indexOf(id) !== -1) {
            throw new CircularDependency(dependencyChain.slice(dependencyChain.indexOf(id)), id);
        } else {
            const dependencyInstances = registeredService.dependencies.map((dependency) => {
                return this.resolveWithDependencyChain(dependency, [...dependencyChain, id]);
            });
            instance = getInstanceWithDependencies(id, registeredService.constructor, dependencyInstances);
        }
        if (registeredService.isSingleton) {
            registeredService.instance = instance;
        }
        return instance;
    }
}
