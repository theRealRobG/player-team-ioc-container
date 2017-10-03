import { ErrorCodes } from './error-codes';
import ContainerError from './error-type';

export class CircularDependency extends Error implements ContainerError {
    public code = ErrorCodes.CIRCULAR_DEPENDENCY;
    public explanation = 'TODO';

    constructor(dependencyChain: string[], id: string) {
        super(`CIRCULAR DEPENDENCY: ${dependencyChain.join(' -> ')} -> ${id}`);
    }
}
