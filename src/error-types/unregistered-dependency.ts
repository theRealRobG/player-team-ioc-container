import { ErrorCodes } from './error-codes';
import ContainerError from './error-type';

export class UnregisteredDependency implements ContainerError {
    public code = ErrorCodes.UNREGISTERED_DEPENDENCY;
    public explanation: string;
    public message: string;

    constructor(unregisteredId: string, dependencyChain: string[]) {
        const originalId = dependencyChain[0] || unregisteredId;
        this.message = `UNREGISTERED DEPENDENCY: ${unregisteredId} WHEN TRYING TO RESOLVE: ${originalId}`;
        const baseExplanation = 'You must register a dependency before it can be used.';
        if (dependencyChain.length === 0) {
            this.explanation = `${baseExplanation} You have tried to resolve ${originalId} but have not registered it.`;
        } else {
            this.explanation = `${baseExplanation} ${dependencyChain.join(' -> ')} -> ${unregisteredId} not registered`;
        }
    }
}
