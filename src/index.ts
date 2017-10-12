import 'reflect-metadata';
import SimpleIoC from './containers/simple-ioc-container';
import TypeCheckIoC from './containers/type-check-ioc-container';

export const SimpleIoCContainer = SimpleIoC;
export const TypeCheckIoCContainer = TypeCheckIoC;
export { get, provides, singleton } from './containers/type-metadata-ioc-container';
