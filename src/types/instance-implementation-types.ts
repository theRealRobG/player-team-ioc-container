export interface InstanceConstructor<T> {
    prototype: T;
    new(...args: any[]): T;
}
export interface InstanceType<T> {
    prototype: T;
}
