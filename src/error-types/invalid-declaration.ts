import { ErrorCodes } from './error-codes';
import ContainerError from './error-type';

export class InvalidDeclaration extends Error implements ContainerError {
    public code = ErrorCodes.INVALID_DECLARATION;
    public explanation = 'TODO';

    constructor(id: string) {
        super(`INVALID DECLARATION: ${id}`);
    }
}
