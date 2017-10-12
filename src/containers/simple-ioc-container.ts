import { InvalidDeclaration } from '../error-types';
import { Declaration } from '../types';
import getParamNames from '../utils/get-param-names';
import getRegisteredServiceInfo from '../utils/get-registered-service-info';
import isConstructable from '../utils/is-constructable';
import BaseContainer from './base-container';

export default class extends BaseContainer {
    public resolve<T>(id: string): T {
        return this.resolveWithDependencyChain<T>(id, []);
    }

    public register<T>(id: string, declaration: Declaration<T>) {
        const { constructor, dependencies, isSingleton } = getRegisteredServiceInfo(id, declaration, getParamNames);
        if (!isConstructable(constructor)) {
            throw new InvalidDeclaration(id, 'The registered function must be constructable (can be called with new)');
        }
        this.registeredServices[id] = { constructor, dependencies, isSingleton };
        return {
            asSingleton: () => this.registeredServices[id].isSingleton = true
        };
    }
}
