import { ErrorCodes } from './error-codes';
import ContainerError from './error-type';

export class CircularDependency implements ContainerError {
    public code = ErrorCodes.CIRCULAR_DEPENDENCY;
    public explanation: string;
    public message: string;

    constructor(dependencyChain: string[], id: string) {
        this.message = `CIRCULAR DEPENDENCY WHEN RESOLVING: ${id}`;
        this.explanation = `${dependencyChain.join(' -> ')} -> ${id}`;
    }
}
