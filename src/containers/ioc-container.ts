import { CircularDependency, UnregisteredDependency } from '../error-types';
import { Declaration, RegisteredService } from '../types';

import getInstanceWithDependencies from '../utils/get-instance-with-dependencies';
import getRegisteredServiceInfo from '../utils/get-registered-service-info';

export class IoCContainer {
    private registeredServices: { [id: string]: RegisteredService<any> } = {};

    public resolve<T>(id: string): T {
        return this.resolveWithDependencyChain<T>(id, []);
    }

    public register(id: string, declaration: Declaration<any>) {
        const { constructor, dependencies } = getRegisteredServiceInfo(id, declaration);
        this.registeredServices[id] = {
            constructor,
            dependencies
        };
    }

    private resolveWithDependencyChain<T>(id: string, dependencyChain: string[]): T {
        const registeredService = this.registeredServices[id] as RegisteredService<T>;
        if (!registeredService) {
            throw new UnregisteredDependency(id, dependencyChain);
        }
        if (registeredService.instance) {
            return registeredService.instance;
        }
        if (registeredService.dependencies.length === 0) {
            return getInstanceWithDependencies<T>(id, registeredService.constructor, []);
        }
        if (dependencyChain.indexOf(id) !== -1) {
            throw new CircularDependency(dependencyChain.slice(dependencyChain.indexOf(id)), id);
        }
        const dependencyInstances = registeredService.dependencies.map((dependency) => {
            return this.resolveWithDependencyChain(dependency, [...dependencyChain, id]);
        });
        return getInstanceWithDependencies(id, registeredService.constructor, dependencyInstances);
    }
}
