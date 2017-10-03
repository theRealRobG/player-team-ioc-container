import { ErrorCodes } from './error-codes';
import ContainerError from './error-type';

export class DependencyConstructionFailure extends Error implements ContainerError {
    public code = ErrorCodes.DEPENDENCY_CONSTRUCTION_FAILURE;
    public explanation = 'TODO';

    constructor(id: string) {
        super(`FAILURE IN CONSTRUCTION OF DEPENDENCY: ${id}`);
    }
}
