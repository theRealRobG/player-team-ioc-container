# player-team-ioc-container

- [Purpose](https://github.com/theRealRobG/player-team-ioc-container#purpose)
- [Installing and using the library](https://github.com/theRealRobG/player-team-ioc-container#installing-and-using-the-library)
- [Building the code](https://github.com/theRealRobG/player-team-ioc-container#building-the-code)
- [Using the library](https://github.com/theRealRobG/player-team-ioc-container#using-the-library)

## Purpose

- The purpose of this repository is to showcase an IOC container written in TypeScript
- There are two IOC containers offered in this repo:
  - `SimpleIoCContainer` - A simple IOC container
  - `TypeCheckIoCContainer` - A container that makes an effort to ensure that the correct interface is being registered against the given id


## Installing and using the library

The library is not (yet) published to npm so you can clone it and include the src files in your project if your project is a TypeScript one, or you can build it and include the JS files found in lib

## Building the code

In the root run

```bash
npm run build
```

This will lint the code and then build it.

Alternatively, to just compile the code, you can run

```bash
npm run compile
```

## Using the library
### SimpleIoCContainer
- [`reslove`](https://github.com/theRealRobG/player-team-ioc-container#resolve)
- [`register`](https://github.com/theRealRobG/player-team-ioc-container#register)
- [Example usage](https://github.com/theRealRobG/player-team-ioc-container#example-usage)

The interface for the `SimpleIoCContainer` is as follows:
```ts
interface ISimpleIoCContainer {
    resolve<T>(id: string): T;
    register<T>(id: string, declaration: Declaration<T>): { asSingleton: () => true };
}
```

#### `resolve`
  - The `resolve` method takes an `id` and will return an instance of whatever was registered against that `id`.

##### Possible errors

  - If nothing was registered against that `id`, it will throw an `UnregisteredDependency` error.
  - If a circular dependency is discovered, it will throw a `CircularDependency` error.
  - If there is an error on construction of a registered implementation, it will throw a `DependencyConstructionFailure` error.

##### Example errors
```ts
const container = new SimpleIoCContainer();
class A {
    constructor(B: B) {}
}
class B {
    constructor(A: A) {}
}
class C {
    constructor() {
        throw new Error();
    }
}
container.register('A', A);
container.register('B', B);
container.register('C', C);

container.resolve('doesNotExist'); // UnregisteredDependency
container.resolve<A>('A'); // CircularDependency
container.resolve<C>('C'); // DependencyConstructionFailure
```

#### `register`
  - The `register` method takes an `id` and a "declaration" for which it will register an implementation against the `id`. It will return an object with one method `asSingleton`, that if called, will register the implementation as a singleton.
  - A `Declaration<T>` is either a constructor of `T` (anything that which called with `new` will return `T`), or an array of strings (representing `id`s for each parameter of the constructor of `T`) followed by a constructor of `T`.

##### Possible errors

  - If the constructor of `T` is not "constructable" (can be called with new), it will throw an `InvalidDeclaration` error.
  - If registering with an array, if the last index is not of type "`function`", it will throw an `InvalidDeclaration` error.
  - If registering with an array, if any index other than the last is not of type "`string`", it will throw an `InvalidDeclaration` error.
  - If registering with an array, if the number of `string` indexes does not match the number of parameters of the constructor of `T`, it will throw an `InvalidDeclaration` error.
  - If you try and register anything that is not an `array` or of type "`function`", it will throw an `InvalidDeclaration` error.

##### Example errors
```ts
const container = new SimpleIoCContainer();
const invalidA = ['A', (A: A) => {}];
const invalidB = ['A', 'B', 'C'];
const invalidC = [class A {}, 'A', class C {}];
const invalidD = ['one', 'two', 'three', class D { constructor(one, two) {}}];
const invalidE = { a: 'a' };

container.register('invalidA', invalidA); // InvalidDeclaration
container.register('invalidB', invalidB); // InvalidDeclaration
container.register('invalidC', invalidC); // InvalidDeclaration
container.register('invalidD', invalidD); // InvalidDeclaration
container.register('invalidE', invalidE); // InvalidDeclaration
```

#### Example usage
Example usage can be found in the reference app under `container-tests/simple-container.ts` and `container-tests/singleton-test.ts`.

The `SimpleIoCContainer` must first be imported, then an instance of a container must be created. It is up to the user where to keep that instance. Each new instance maintains separate implementations; registering an implemntation in one container has no effect on any other instance of a container.

A basic example is shown below:
```ts
import { SimpleIoCContainer } from 'player-team-ioc-container';

class A {
    constructor(private B: B, private C: C) {}
    speak() {
        console.log('A says hello');
        this.B.speak();
        this.C.speak();
    }
}
class B {
    speak() {
        console.log('B says hello');
    }
}
class C {
    constructor(private minifiedD: D) {}
    speak() {
        console.log('C says hello');
        this.minifiedD.speak();
    }
}
class D {
    speak() {
        console.log('D says hello');
    }
}

const container = new SimpleIoCContainer();
container.register('A', A);
container.register('B', B);
container.register('C', ['D', C]);
container.register('D', D);

const a = container.resolve<A>('A');
a.speak();
/* Result:
    A says hello
    B says hello
    C says hello
    D says hello
*/
```

### TypeCheckIoCContainer
- [`new TypeCheckIoCContainer(config: RegisteredInterfaces)`](https://github.com/theRealRobG/player-team-ioc-container#new-typecheckioccontainerconfig-registeredinterfaces)
- [`get`](https://github.com/theRealRobG/player-team-ioc-container#get)
- [`provides`](https://github.com/theRealRobG/player-team-ioc-container#provides)
- [`singleton`](https://github.com/theRealRobG/player-team-ioc-container#singleton)
- [Example usage](https://github.com/theRealRobG/player-team-ioc-container#example-usage)

The interface for the `TypeCheckIoCContainer` is as follows:
```ts
interface ITypeCheckIoCContainer {
    get<T>(id: string): T;
    provides<T>(id: string, interfacePrototypeForImpl: T): (implementation: Constructor<T>) => void;
    singleton<T>(id: string, interfacePrototypeForImpl: T): (implementation: Constructor<T>) => void;
}
```

`provides` and `singleton` are designed to be used as [decorators](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841).

#### `new TypeCheckIoCContainer(config: RegisteredInterfaces)`

The constructor for `TypeCheckIoCContainer` takes a config object of `id`s against functions. The intention is to configure all of the expected interfaces on the construction of the container. Then at a later stage, when an implementation is registered, a check that the correct implementation has been registered. TypeScript `interface`s can not be used, as they do not compile to JavaScript, however `abstract` classes can be used and have almost identical behaviour.

##### Possible errors
  - If no config is provided, it will throw a `MissingConfig` error.
  - If any of the registered interfaces do not have a `prototype` or do not have a constructor name (`prototype.constructor.name`), it will throw an `InvalidConfig` error.

##### Example errors
```ts
const container = new TypeCheckIoCContainer(); // MissingConfig
const container = new TypeCheckIoCContainer({ A: {} }); // InvalidConfig
```

##### Example
```ts
abstract class IA {
    abstract a(): string;
}
abstract class IB {
    abstract b(): number;
}
abstract class IC {
    abstract c(): boolean;
}
const config = {
    A: IA,
    B: IB,
    C: IC
}
const container = new TypeCheckIoCContainer(config);
```

#### `get`
This has exactly the same behaviour as `resolve` in the `SimpleIoCContainer`.

#### `provides`
  - The first argument is the `id` you are registering an implementation against.
  - The second argument is the `prototype` of the interface (`abstract class`) that you will be implementing.
  - The method will decorate a constructor of T, where T implements the given interface.

##### Possible errors
Most of the same errors can arrise as `register` for the `SimpleIoCContainer`; however there are more possible errors:
  - If the `interfacePrototypeForImpl` is an object literal (its constructor has name `Object`), it will throw an `InvalidDeclaration` error.
  - If there is no interface registered against the given `id`, it will throw an `InvalidDeclaration` error.
  - If you try to register an implementation of an interface other than the one that was configured for the given `id` on construction of the container, it will throw an `InvalidDeclaration` error.

##### Error examples
```ts
@container.provides('A', { a: () => '' }) // InvalidDeclaration
class InvalidA {
    a() {
        return '';
    }
}
@container.provides('DoesNotExist', IB.prototype) // InvalidDeclaration
class InvalidB {
    b() {
        return Infinity;
    }
}
@container.provides('B', IC.prototype) // InvalidDeclaration
class InvalidC {
    c() {
        return false;
    }
}
```

##### Example
```ts
@container.provides('A', IA.prototype)
class A {
    a() {
        return 'A says hello';
    }
}
@container.provides('B', IB.prototype)
class CouldBeNamedAnything {
    b() {
        return 42;
    }
}
@container.provides('C', IC.prototype)
class Jam {
    c() {
        return 'jam' !== 'peanut butter';
    }
}
```

#### `singleton`
This is identical to `provides` except that it registers the implementation as a singleton.

#### Example usage
An example of the usage of `TypeCheckIoCContainer` can be found in the reference app under `container-tests/type-check-container.ts`.
