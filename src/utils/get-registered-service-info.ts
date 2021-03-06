import { InvalidDeclaration } from '../error-types';
import {
    Declaration,
    InstanceConstructor,
    RegisteredService
} from '../types';

export default function getRegisteredServiceInfo<T>(
    id: string,
    declaration: Declaration<T>,
    getParamsMethod: (constructor: InstanceConstructor<T>) => string[]
): RegisteredService<T> {
    if (typeof declaration === 'function') {
        return {
            constructor: declaration,
            dependencies: getParamsMethod(declaration),
            isSingleton: false
        };
    } else if (Array.isArray(declaration)) {
        const { constructor, dependencies } = {
            constructor: declaration.slice(-1)[0] as InstanceConstructor<any>,
            dependencies: declaration.slice(0, -1) as string[]
        };
        const errorMessageStart = 'When registering using array declaration, ';
        if (typeof constructor !== 'function') {
            const message = `${errorMessageStart}the last index of the array must be a function`;
            throw new InvalidDeclaration(id, message);
        }
        if (dependencies.some((dependency) => typeof dependency !== 'string')) {
            const message = `${errorMessageStart}all dependency declarations must be strings`;
            throw new InvalidDeclaration(id, message);
        }
        const dependenciesLength = dependencies.length;
        const parametersLength = getParamsMethod(constructor).length;
        if (dependenciesLength !== parametersLength) {
            const midMessage = `${errorMessageStart}the declared dependencies must equal the expected parameters: `;
            const message = `${midMessage}No. Dependencies: ${dependenciesLength}, No. Parameters: ${parametersLength}`;
            throw new InvalidDeclaration(id, message);
        }
        return {
            constructor,
            dependencies,
            isSingleton: false
        };
    } else {
        throw new InvalidDeclaration(id, 'Declaration must be a function or an array');
    }
}
