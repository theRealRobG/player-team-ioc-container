import { ErrorCodes } from './error-codes';
import ContainerError from './error-type';

export class MissingConfig implements ContainerError {
    public code = ErrorCodes.MISSING_CONFIG;
    public explanation: string;
    public message: string;

    constructor() {
        this.message = `CONFIG NOT PROVIDED WHEN INSTANTIATING CONTAINER`;
        this.explanation = `WHEN USING THE TYPE CHECK IOC CONTAINER, ` +
            `YOU MUST PROVIDE A CONFIGURATION FOR THE EXPECTED INTERFACES`;
    }
}
