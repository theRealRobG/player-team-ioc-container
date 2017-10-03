import { DependencyConstructionFailure } from '../error-types';
import { FunctionDeclaration, InstanceConstructor, InstanceFunction } from '../types';

export default function getInstance<T>(id: string, constructor: FunctionDeclaration<T>, dependencyInstances: any[]): T {
    let instance: T;
    try {
        instance = new (constructor as InstanceConstructor<T>)(...dependencyInstances);
    } catch (e) {
        if (e && e.message && typeof e.message === 'string' && e.message.indexOf('is not a constructor')) {
            try {
                instance = (constructor as InstanceFunction<T>)(...dependencyInstances);
            } catch (err) {
                throw new DependencyConstructionFailure(id, e.toString());
            }
        } else {
            throw new DependencyConstructionFailure(id, e.toString());
        }
    }
    return instance;
}
