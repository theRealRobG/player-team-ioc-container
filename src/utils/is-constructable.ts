import { FunctionDeclaration } from '../index';

// https://stackoverflow.com/questions/40922531/how-to-check-if-a-javascript-function-is-a-constructor
export default function isConstructable(f: FunctionDeclaration): f is FunctionConstructor {
    try {
      new (f as FunctionConstructor)(); // tslint:disable-line
    } catch (err) {
      if (err.message.indexOf('is not a constructor')) {
        return false;
      }
    }
    return true;
  }
