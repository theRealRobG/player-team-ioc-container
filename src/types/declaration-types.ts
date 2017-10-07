import { InstanceConstructor } from './instance-implementation-types';

export type ArrayDeclaration<T> = Array<string | InstanceConstructor<T>>;
export type Declaration<T> = InstanceConstructor<T> | ArrayDeclaration<T>;
