import { ErrorCodes } from './error-codes';
import ContainerError from './error-type';

export class DependencyConstructionFailure implements ContainerError {
    public code = ErrorCodes.DEPENDENCY_CONSTRUCTION_FAILURE;
    public explanation: string;
    public message: string;

    constructor(id: string, message: string) {
        this.message = `FAILURE IN CONSTRUCTION OF DEPENDENCY: ${id}`;
        this.explanation = message;
    }
}
