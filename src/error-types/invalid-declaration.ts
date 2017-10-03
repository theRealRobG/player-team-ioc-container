import { ErrorCodes } from './error-codes';
import ContainerError from './error-type';

export class InvalidDeclaration implements ContainerError {
    public code = ErrorCodes.INVALID_DECLARATION;
    public explanation: string;
    public message: string;

    constructor(id: string, message: string) {
        this.message = `INVALID DECLARATION WHEN REGISTERING: ${id}`;
        this.explanation = message;
    }
}
