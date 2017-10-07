import { DependencyConstructionFailure } from '../error-types';
import { InstanceConstructor } from '../types';

export default function getInstance<T>(id: string, constructor: InstanceConstructor<T>, dependencyInstances: any[]): T {
    try {
        return new (constructor as InstanceConstructor<T>)(...dependencyInstances);
    } catch (e) {
        throw new DependencyConstructionFailure(id, e.toString());
    }
}
