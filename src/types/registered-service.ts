import { InstanceConstructor } from './instance-implementation-types';

export interface RegisteredService<T> {
    constructor: InstanceConstructor<T>;
    dependencies: string[];
    isSingleton: boolean;
    instance?: T;
}
