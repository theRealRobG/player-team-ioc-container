import { ErrorCodes } from './error-codes';

export default interface ContainerError extends Error {
    code: ErrorCodes;
    explanation: string;
}
