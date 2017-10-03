import { InstanceConstructor, InstanceFunction } from './instance-implementation-types';

export type FunctionDeclaration<T> = InstanceFunction<T> | InstanceConstructor<T>;
export type ArrayDeclaration<T> = Array<string | FunctionDeclaration<T>>;
export type Declaration<T> = FunctionDeclaration<T> | ArrayDeclaration<T>;
