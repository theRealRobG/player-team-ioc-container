import { ErrorCodes } from './error-codes';

export default interface ContainerError {
    code: ErrorCodes;
    explanation: string;
    message: string;
}
