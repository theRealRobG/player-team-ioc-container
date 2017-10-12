import { InstanceConstructor } from '../types';

export default function getParamNames<T>(target: InstanceConstructor<T>) {
    const paramTypes = Reflect.getMetadata('design:paramtypes', target);
    return paramTypes ? paramTypes.map((type: any) => type.name) as string[] : [];
}
