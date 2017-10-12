import { InvalidDeclaration } from '../error-types';
import { InstanceConstructor, InstanceType } from '../types';
import getParamNames from '../utils/get-class-param-names';
import getRegisteredServiceInfo from '../utils/get-registered-service-info';
import isConstructable from '../utils/is-constructable';
import BaseResolver from './base-container';

interface TypeWithName<T> extends InstanceType<T> {
    name: string;
}

class TypeMetadataIoCContainer extends BaseResolver {
    public resolve<T>(type: TypeWithName<T>): T {
        return this.resolveWithDependencyChain(type.name, []);
    }
    public register<T>(type: InstanceType<T>, target: InstanceConstructor<T>) {
        const id = (type as TypeWithName<T>).name;
        const { constructor, dependencies, isSingleton } = getRegisteredServiceInfo(id, target, getParamNames);
        if (!isConstructable(constructor)) {
            throw new InvalidDeclaration(id, 'The registered function must be constructable (can be called with new)');
        }
        this.registeredServices[id] = { constructor, dependencies, isSingleton };
        return {
            asSingleton: () => this.registeredServices[id].isSingleton = true
        };
    }
}

const container = new TypeMetadataIoCContainer();

export function get<T>(type: InstanceType<T>): T {
    return container.resolve<T>(type as TypeWithName<T>);
}
export function provides<T>(type: InstanceType<T>) {
    return (target: InstanceConstructor<T>) => {
        container.register(type, target);
    };
}
export function singleton<T>(type: InstanceType<T>) {
    return (target: InstanceConstructor<T>) => {
        container.register(type, target).asSingleton();
    };
}
