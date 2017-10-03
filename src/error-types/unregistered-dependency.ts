import { ErrorCodes } from './error-codes';
import ContainerError from './error-type';

export class UnregisteredDependency extends Error implements ContainerError {
    public code = ErrorCodes.UNREGISTERED_DEPENDENCY;
    public explanation = 'TODO';

    constructor(id: string) {
        super(`UNREGISTERED DEPENDENCY: ${id}`);
    }
}
