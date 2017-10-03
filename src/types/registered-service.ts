import { FunctionDeclaration } from './declaration-types';

export interface RegisteredService<T> {
    constructor: FunctionDeclaration<T>;
    dependencies: string[];
    instance?: T;
}
