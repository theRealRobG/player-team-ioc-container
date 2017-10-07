import { ErrorCodes } from './error-codes';
import ContainerError from './error-type';

export class InvalidConfig<T> implements ContainerError {
    public code = ErrorCodes.INVALID_CONFIG;
    public explanation: string;
    public message: string;

    constructor(id: string, constructor: T) {
        this.message = `INVALID CONFIGURATION: ${id}`;
        this.explanation = `Attempting to register "${constructor}" against "${id}", but "${constructor}" is not` +
            `constructable (can be called with new)`;
    }
}
