export interface InstanceConstructor<T> {
    new(...args: any[]): T;
}
export type InstanceFunction<T> = (...args: any[]) => T;
