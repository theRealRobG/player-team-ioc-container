export interface InstanceConstructor<T> {
    new(...args: any[]): T;
}
