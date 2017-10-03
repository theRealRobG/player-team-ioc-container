import { InvalidDeclaration } from '../error-types';
import {
    Declaration,
    FunctionDeclaration,
    RegisteredService
} from '../types';

import getParamNames from './get-param-names';

export default function getRegisteredServiceInfo(id: string, declaration: Declaration<any>): RegisteredService<any> {
    if (typeof declaration === 'function') {
        return {
            constructor: declaration,
            dependencies: getParamNames(declaration)
        };
    } else if (Array.isArray(declaration)) {
        return {
            constructor: declaration.slice(-1)[0] as FunctionDeclaration<any>,
            dependencies: declaration.slice(0, -1) as string[]
        };
    } else {
        throw new InvalidDeclaration(id);
    }
}
