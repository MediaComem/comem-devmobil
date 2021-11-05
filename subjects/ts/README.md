# TypeScript

<!-- slide-front-matter class: center, middle -->

## Summary

Learn the basics of [TypeScript][typescript], a typed superset of JavaScript that compiles to plain JavaScript.

TypeScript is also the language recommended by the Angular team to develop [Angular][angular] applications
(but it can be used with any framework or library).

This tutorial is a summary of some of the [TypeScript Handbook][typescript-handbook]'s chapters.

<!-- slide-include ../../BANNER.md -->

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Types](#types)
  - [Basic types](#basic-types)
  - [Type checking](#type-checking)
  - [Function parameter & return types](#function-parameter--return-types)
  - [Function types](#function-types)
  - [Type inference](#type-inference)
  - [Any](#any)
    - [Type assertions](#type-assertions)
  - [Union types](#union-types)
    - [Type guards](#type-guards)
  - [Enums](#enums)
  - [Void](#void)
  - [Type aliases](#type-aliases)
- [Functions](#functions)
  - [Mandatory parameters](#mandatory-parameters)
  - [Optional parameters](#optional-parameters)
- [Classes](#classes)
  - [Class types](#class-types)
  - [Accessibility modifiers](#accessibility-modifiers)
    - [Private](#private)
    - [Protected](#protected)
    - [Read-only](#read-only)
    - [Parameter properties](#parameter-properties)
  - [Abstract classes](#abstract-classes)
    - [Abstract methods](#abstract-methods)
    - [Abstract classes cannot be instantiated](#abstract-classes-cannot-be-instantiated)
- [Interfaces](#interfaces)
  - [Defining an interface](#defining-an-interface)
    - [Interface checks](#interface-checks)
  - [Optional properties](#optional-properties)
  - [Interface functions](#interface-functions)
    - [Classes implementing interfaces](#classes-implementing-interfaces)
  - [Extending interfaces](#extending-interfaces)
- [Generics](#generics)
  - [Generic functions](#generic-functions)
    - [Pseudo-generic function with `any`](#pseudo-generic-function-with-any)
    - [Using generics in a function](#using-generics-in-a-function)
  - [Generic type syntax](#generic-type-syntax)
  - [Generic type argument inference](#generic-type-argument-inference)
  - [Generic classes & interfaces](#generic-classes--interfaces)
  - [Generic constraints](#generic-constraints)
    - [Adding a generic type argument constraint](#adding-a-generic-type-argument-constraint)
- [Decorators](#decorators)
  - [What is a decorator?](#what-is-a-decorator)
    - [Implementing a decorator](#implementing-a-decorator)
  - [Decorator factory](#decorator-factory)
  - [Class decorator example](#class-decorator-example)
  - [Method decorator example](#method-decorator-example)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Types

<!-- slide-front-matter class: center, middle -->

Define interfaces between software components.



### Basic types

<!-- slide-column 40 -->

JavaScript variables are untyped:

```js
// Statement Name  Value
         let foo = 'bar';
```

<!-- slide-column -->

In TypeScript, you can specifiy a type after the name and before the assignment:

```ts
// Statement Name Type     Value
         let foo: string = 'bar';
```

<!-- slide-container -->

Here's a few examples with the basic types:

```ts
// Primitive types
let isDone: boolean = false;
let value: number = 6;
let name: string = 'World';
let hello: string = \`Hello ${name}!`;

// Arrays
let digits: number[] = [ 1, 2, 3 ];
let names: string[] = [ 'Alice', 'Bob' ];
```



### Type checking

TypeScript will not compile code that attempts to use values of the wrong type:

```ts
let value: number = 6;
value = 'foo';
//      ^^^^^ ERROR!
//      Type '"foo"' is not assignable to type 'number'.

let names: string[] = [ 'Alice', 'Bob' ];
names.push(42);
//         ^^ ERROR!
//         Argument of type '42' is not assignable to parameter of type 'string'.

value.toString(2); // 110
value.yeehaw();
//    ^^^^^^ ERROR!
//    Property 'yeehaw' does not exist on type 'number'.
```

In exchange for losing some of JavaScript's **flexibility**, you gain:

* **Clarity:** explicit types help understand the code.
* **Compile-time checking:** some errors can be identified when writing the code, rather than at runtime.



### Function parameter & return types

The parameters and return values of TypeScript functions can also be typed:

```ts
function multiply(n: number, times: number): number {
  return n * times;
}

// OK
let twoTimesThree: number = multiply(2, 3);

let fortyTwo: string = multiply(2, 21);
//                     ^^^^^^^^^^^^^^^ ERROR!
//                     Type 'number' is not assignable to type 'string'.

let foo: number = multiply(2, 'bar');
//                            ^^^^^ ERROR!
//                            Argument of type '"bar"' is not assignable
//                            to parameter of type 'number'.
```



### Function types

You can also define the **type of a function** itself:

```ts
let mathOperation: (a: number, b: number) => number;

// Addition
mathOperation = function(a: number, b: number): number {
  return a + b;
};

// Multiplication
mathOperation = function(a: number, b: number): number {
  return a * b;
};

// Wrong types
mathOperation = function(foo: string): number {
  return foo.length;
};
//              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ERROR!
// Type '(foo: string) => number' is not assignable
// to type '(a: number, b: number) => number'.
// Types of parameters 'foo' and 'a' are incompatible.
// Type 'number' is not assignable to type 'string'.
```



### Type inference

Even when you do not explicitly use types, TypeScript will attempt to **infer** the type of your variables:

```ts
let done = false;
done = 'YES';
//     ^^^^^ ERROR!
//     Type '"YES"' is not assignable to type 'boolean'.

let values = [ 1, 2, 3 ];
values.push('Bob');
//          ^^^^^ ERROR!
//          Argument of type '"Bob"' is not assignable
//          to parameter of type 'number'.
```



### Any

The `any` type allows you to opt out of type checking for some variables:

```ts
let value: any = true;
// No errors, like in standard JavaScript
value = 42;
value = 'Bob';
```

This is useful if you are using a third-party library, since you might not know a value's exact type.
However, it completely **disables all checks** performed by TypeScript:

```ts
let value: any = 4;
console.log(value.toString()); // "4"

// Will compile, but this error will occur at runtime:
// TypeError: n.yeehaw is not a function
console.log(value.yeehaw());
```

You should **not** use `any` unless there's a very good reason to, as it makes you lose one of the major benefits of using TypeScript.

#### Type assertions

Sometimes you will know what type a value is when TypeScript doesn't, typically with a variable of type `any`.

In those cases, you'll want to tell Typescript what is the type of the variable.

That's called **Type assertion** and there are two ways to achieve it:

```ts
let value: any = 'foo';

// "Angle-bracket" syntax
let upper: string = (<string>value).toUpperCase();

// "As" syntax, which is the recommanded syntax
let length: number = (value as string).length;
```

Again, you should **not** have to use this in most of your TypeScript code.

### Union types

A union type describes a value that can be of **one of several types**:

```ts
let numeral: number | string = 42;
// OK
numeral = 'forty-two';
```

But it will still complain when you try to use other types:

```ts
numeral = true;
//        ^^^^ ERROR!
//        Type 'true' is not assignable to type 'string | number'.
```

This can be useful, for example, when creating arrays that initially contain one type of element,
but that will also contain other types later:

```ts
let numerals: (string | number)[] = [ 1, 2, 3 ];
// OK
numerals.push('forty-two');
```

#### Type guards

Sometimes you will have a function parameter that can be of one type or another.
TypeScript cannot know which type the value is if you do not check:

```ts
function lower(value: string | number): string {
  return value.toLowerCase();
  //           ^^^^^^^^^^^ ERROR!
  //           Property 'toLowerCase' does not exist on type 'string | number'.
  //           Property 'toLowerCase' does not exist on type 'number'.
}
```

You can use a **type guard** to *narrow* a value to a specific type:

```ts
function lower(value: string | number): string {
  if (typeof(value) == 'string') {
    // In this block, TypeScript knows that "value" is a string
    return value.toLowerCase();
  } else {
    // In this block, TypeScript knows that "value" is a number
    // (since it's not a string, and it's either a string or a number)
    return (value - 1).toString();
  }
}

console.log(lower('HEY'));  // "hey"
console.log(lower(43));     // "42"
```



### Enums

You can define [enumerations][typescript-enums] with TypeScript:

```ts
enum Direction {
  North,
  East,
  South,
  West
}

// Variables can use the enum as a type.
let value: Direction;

// The enum's values can be accessed as properties.
value = Direction.North;

// Check whether a value is one of the enum's values.
if (value === Direction.South) {
  console.log('Going south');
} else {
  console.log('Not going south'); // "Not going south"
}
```



### Void

`void` indicates the **absence of any type** at all.
It is commonly used to indicate that a function does not return a value:

```ts
function warnUser(): void {
  alert("BEWARE!");
}

let foo: string = warnUser();
//                ^^^^^^^^ ERROR!
//                Type 'void' is not assignable to type 'string'.
```



### Type aliases

Type aliases create a **new name for a type**.
They can be used to "rename" primitives, unions, tuples, and any other types that you'd otherwise have to write by hand:

```ts
type GitHash = string;
type StringOrNumber = string | number;

let hash: GitHash = '9e91aa6c05f96251c20507f9068d177019af2742';

let value: StringOrNumber = 'foo';
value = 42;
```

Aliasing doesn’t actually create a new type—it creates a new name to refer to that type.
It can be used as a form of documentation, e.g. to improve readability.



## Functions

<!-- slide-front-matter class: center, middle -->

How to *do* things.



### Mandatory parameters

In TypeScript, every function parameter is assumed to be required by the function.
You can pass `null` or `undefined`, but the compiler will check that you have provided the correct number of parameters.

```ts
function buildName(firstName: string, lastName: string): string {
    return firstName + " " + lastName;
}

let result1 = buildName("Bob");
//                      ^^^^^ ERROR!
//                      Expected 2 arguments, but got 1.

let result2 = buildName("Bob", "Adams", "Sr.");
//                      ^^^^^ ERROR!
//                      Expected 2 arguments, but got 3.

let result3 = buildName("Bob", "Adams");
console.log(result3); // "Bob Adams"

// You can also give null or undefined:
let result4 = buildName("Bob", null);
console.log(result4); // "Bob null"
```



### Optional parameters

In JavaScript, every parameter is optional, and their value is `undefined` if not provided:

```js
function buildName(firstName, lastName) {
  return [ firstName, lastName ].filter(value => value !== undefined).join(' ');
}

console.log(buildName('John'));         // "John"
console.log(buildName('John', 'Doe'));  // "John Doe"
```

You can obtain the same result in TypeScript by adding an **interrogation mark** to the end of parameters you want to be optional:

```ts
function buildName(firstName: string, lastName?: string): string {
  return [ firstName, lastName ].filter(value => value !== undefined).join(' ');
}

console.log(buildName('John'));         // "John"
console.log(buildName('John', 'Doe'));  // "John Doe"
```

Any optional parameter must **follow** required parameters.



## Classes

<!-- slide-front-matter class: center, middle -->

Object-oriented TypeScript.



### Class types

TypeScript extends the JavaScript classes available since ECMAScript 6.
You can use types in them as well:

```ts
class Greeter {

  // Specify the type of fields.
  name: string;

  // Specify the type of the constructor's parameters.
  constructor(name: string) {
    this.name = name;
  }

  // Specify the type of method parameters and/or their return value.
  greet(): void {
    return \`Hello ${this.name}!`;
  }
}

let greeter = new Greeter('World');
greeter.greet(); // "Hello World!"
```



### Accessibility modifiers

The `private`, `protected` and `public` accessibility modifiers can be used in TypeScript classes to restrict access to fields or methods.
By default, a field or method is always `public`:

```ts
class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

new Animal('Cat').name; // "Cat"
```

The following class definition, with the `public` modifier added to the `name` field, is **equivalent** and behaves the same:

```ts
class Animal {
  public name: string;
  constructor(name: string) {
    this.name = name;
  }
}
```

#### Private

When a field or method is marked `private`, it cannot be accessed from outside of its containing class:

```ts
class Animal {

  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  private getName(): string {
    return this.name;
  }
}

new Animal('Cat').name;
//                ^^^^ ERROR!
//                Property 'name' is private and
//                only accessible within class 'Animal'.

new Animal('Cat').getName();
//                ^^^^^^^ ERROR!
//                Property 'getName' is private and
//                only accessible within class 'Animal'.
```

#### Protected

A field or method marked `protected` behaves like one marked `private`,
with the exception that it **can** be accessed from within a **sub-class**:

```ts
class Animal {
  protected name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class Cat extends Animal {
  constructor() {
    super('Cat');
  }

  describe() {
    return \`I am a ${this.name}`;
  }
}

let cat = new Cat();
console.log(cat.describe()); // "I am a Cat"
console.log(cat.name);
//              ^^^^ ERROR!
//              Property 'name' is protected and only
//              accessible within class 'Animal' and its subclasses.
```

#### Read-only

The `readonly` modifier forces a field to be initialized at its declaration or in the constructor.
It cannot be modified later:

```ts
class Animal {
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }
}

let cat = new Animal('Cat');
cat.name = 'Dog';
//  ^^^^ ERROR!
//  Cannot assign to 'name' because it is a constant or a read-only property.
```

#### Parameter properties

It is a common pattern to have a field with an accessibility modifier
and to set the value of that field directly from a constructor parameter:

```ts
class Animal {
  private name: string;
  readonly age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}
```

TypeScript's **parameter properties** let you **create and initialize**
a field in one place by using an accessibility modifier in the constructor.

The following code is **equivalent** to the previous example:

```ts
class Animal {
  constructor(private name: string, readonly age: number) {
  }
}
```



### Abstract classes

Abstract classes are base classes from which other classes may be derived.

An abstract class **may contain implementation** details for its methods.
The `abstract` keyword is used to define abstract classes as well as abstract methods within that class:

```ts
abstract class Animal {
  abstract getCry(): string;

  cry(): void {
    console.log(\`I sound like this: ${this.getCry()}`);
  }
}

class Cat extends Animal {
  getCry(): string {
    return 'Meow';
  }
}

const cat = new Cat();
cat.cry(); // "I sound like this: Meow"
```

#### Abstract methods

A non-abstract class extending an abstract class **must implement all its abstract methods**:

```ts
abstract class Animal {
  abstract getCry(): string;

  cry(): void {
    console.log(\`I sound like this: ${this.getCry()}`);
  }
}

class Dog extends Animal {
  getBark(): string {
    return 'Woof';
  }
}
// ERROR!
// Non-abstract class 'Dog' does not implement
// inherited abstract member 'getCry' from class 'Animal'.
```

#### Abstract classes cannot be instantiated

An abstract class **cannot be instantiated directly**:

```ts
abstract class Animal {
  abstract getCry(): string;

  cry(): void {
    console.log(\`I sound like this: ${this.getCry()}`);
  }
}

const animal = new Animal();
//             ^^^^^^^^^^ ERROR!
//             Cannot create an instance of the abstract class 'Animal'.
```



## Interfaces

<!-- slide-front-matter class: center, middle -->

A powerful way of defining contracts within your code.



### Defining an interface

Here's a simple example:

```ts
interface LabelledValue {
  label: string;
}

function printLabel(value: LabelledValue) {
  console.log(value.label);
}

let value = { size: 10, label: "Size 10 Object" };
printLabel(value); // "Size 10 Object"
```

TypeScript will check that when `printLabel` is called, its parameter has a `label` property of type `string`.

Notice that the object in this example has *more properties*,
but the compiler only checks that **at least** the ones required are present and match the required types.

#### Interface checks

If you try to pass an object which does not match the interface, TypeScript will refuse to compile the code:

```ts
let invalidValue = { size: 185, name: 'Bob' };
printLabel(invalidValue);
//         ^^^^^^^^^^^^ ERROR!
//         Argument of type '{ size: number; name: string; }'
//         is not assignable to parameter of type 'LabelledValue'.
//         Property 'label' is missing in type '{ size: number; name: string; }'.

invalidValue = { label: true };
printLabel(invalidValue);
//         ^^^^^^^^^^^^ ERROR!
//         Argument of type '{ label: boolean; }'
//         is not assignable to parameter of type 'LabelledValue'.
//         Types of property 'label' are incompatible.
//         Type 'boolean' is not assignable to type 'string'.
```



### Optional properties

Much like with function parameters, you can mark some properties of an interface as **optional** by adding an **interrogation mark** after the property name.

This is a popular pattern when creating "option bags" where you pass an object to a function that only has a couple of properties filled in.

```ts
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): {color: string; area: number} {
  const newSquare = {color: "white", area: 100};
  if (config.color) {
    newSquare.color = config.color;
  }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

let square = createSquare({ color: "black" }); // OK, the width is optional
```



### Interface functions

An interface is also capable of describing that an object must have a specific function:

```ts
interface Greeter {
  greet(name: string): string;
}

let value: Greeter;

// OK, this object has a "greet" function.
value = {
  greet: (name: string) => \`Hi ${name}!`
};

console.log(value.greet('Bob')); // "Hi Bob!"

// Not OK.
value = { foo: 'bar' };
//      ^^^^^^^^^^^^^^ ERROR!
//      Type '{ foo: string; }' is not assignable to type 'Greeter'.
//      Object literal may only specify known properties,
//      and 'foo' does not exist in type 'Greeter'.
```

#### Classes implementing interfaces

Classes which implement this interface **must** have a `greet` method:

```ts
interface Greeter {
  greet(name: string): string;
}

class Person implements Greeter {
  greet(name: string): string {
    return \`Hello ${name}!`;
  }
}

class Cat implements Greeter {
  greet(): string {
    return 'Meow!';
  }
}

class Dog implements Greeter {
  bark(): string {
    return 'Woof!';
  }
}
// ERROR!
// Class 'Dog' incorrectly implements interface 'Greeter'.
// Property 'greet' is missing in type 'Dog'.
```



### Extending interfaces

Like classes, interfaces can **extend** each other.
This allows you to copy the properties and functions of one interface into another:

```ts
interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}

let square: Square;

square = {
  color: 'blue',
  sideLength: 10
};
```



## Generics

<!-- slide-front-matter class: center, middle -->

Work on the data of today as well as the data of tomorrow.



### Generic functions

Let's take a look at this logging function which logs the specified value and returns it:

```ts
function logAndReturnValue(arg: `number`): `number` {
  console.log(arg);
  return arg;
}

const n = logAndReturnValue(42); // 42

console.log(n.toUpperCase());
//           ^^^^^^^^^^^^^^ ERROR!
// Property 'toUppercase' does not exist on type 'number'.
```

It's typed and returns the value as a `number`, which is good,
because then TypeScript won't let us use properties or methods that should not be available.

**However,** this "log and return" functionality could be **generic** and take **any type of value**.

#### Pseudo-generic function with `any`

You could rewrite the function using the `any` type:

```ts
function logAndReturnValue(arg: `any`): `any` {
  console.log(arg);
  return arg;
}

const n = logAndReturnValue(42);       // 42
const s = logAndReturnValue('Hello');  // Hello

console.log(s.toUpperCase());

// No error in editor at compile time.
// TypeError at runtime: n.toUpperCase is not a function
console.log(n.toUpperCase());
```

It now takes and returns any type of value,
but you **lose the information** about **what type of value** the function **returns**.

#### Using generics in a function

Instead, we need a way of **capturing the type** of the argument in such a way that we can also use it to denote what is being returned:

```ts
function logAndReturnValue`<T>`(arg: `T`): `T` {
  console.log(arg);
  return arg;
}

const n = logAndReturnValue<number>(42); // 42

console.log(n.toUpperCase());
//           ^^^^^^^^^^^^^^ ERROR!
// Property 'toUppercase' does not exist on type 'number'.
```

We've now added a type variable `T` to the identity function.
This `T` allows us to capture the type the user provides (e.g. number), so that we can use that information later.
Here, we use `T` again as the return type.
This allows us to use the function's **input type** to describe its **output type**.

The function is now **generic**.
It works over a range of types, **without losing the type information** of its return value.



### Generic type syntax

You may name the **type variable** however you want.
It's often named `T` when there is only one, but that's not mandatory:

```ts
function logAndReturnValue`<ValueType>`(arg: `ValueType`): `ValueType` {
  console.log(arg);
  return arg;
}
```

You may specify **multiple type variables** if your function needs to have multiple generic type arguments:

```ts
function logAndReturnFirst`<T, U>`(arg1: `T`, arg2: `U`): `T` {
  console.log(arg1);
  console.log(arg2);
  return arg1;
}
```



### Generic type argument inference

You may have noticed that we specified the **input type** of the generic function **when calling it**:

```ts
function logAndReturnValue<T>(arg: T): T {
  console.log(arg);
  return arg;
}

const n = logAndReturnValue`<number>`(42); // 42
```

This is not mandatory.
If you don't specify a type argument, TypeScript will automatically **infer the type** based on the argument you pass in:

```ts
// TypeScript automatically infers that 42 is a number.
const n = logAndReturnValue(42); // 42

console.log(n.toUpperCase());
//           ^^^^^^^^^^^^^^ ERROR!
// Property 'toUppercase' does not exist on type 'number'.
```

However, in some cases it may improve the **readability** of your code to explicity specify the type.



### Generic classes & interfaces

Generic type arguments can also be used on **classes**:

```ts
`class` GenericValueLogger`<T>` {

  constructor(private value: `T`) {}

  logAndReturn(): `T` {
    console.log(this.value);
    return this.value;
  }
}

const logger = new GenericValueLogger`<number>`(42);

const n = logger.logAndReturn(); // 42

console.log(n.toUpperCase());
//           ^^^^^^^^^^^^^^ ERROR!
// Property 'toUppercase' does not exist on type 'number'.
```

And on **interfaces**:

```ts
`interface` GenericLogger`<T>` {
  logValueAndReturn(arg: `T`): `T`;
}
```



### Generic constraints

What if we wanted to create a generic logging function that logs an object's **length**.
It should work with **any type of object that has a length**, such as an **array** or **string**.

```ts
function logLengthAndReturn<T>(arg: T): T {
  console.log(arg`.length`);
  //             ^^^^^^^ ERROR!
  // Property 'length' does not exist on type 'T'.
  return arg;
}
```

In this example we simply use `T` as a type argument.
TypeScript will refuse to compile the function, because `T` could be **any type**, not just a string or an array.

#### Adding a generic type argument constraint

By using the `extends` keyword, you can specify that a type argument **must match a constraint**.
In this case, we require that the argument of type `T` must match an interface that requires a `length` property:

```ts
interface HasLength {
  length: number;
}

function logLengthAndReturn<`T extends HasLength`>(arg: T): T {
  console.log(arg.length);
  return arg;
}

const a = logLengthAndReturn([ 1, 2, 3 ]);  // 3
const s = logLengthAndReturn('abcdef');     // 5

console.log(a.reverse());      // [ 3, 2, 1 ]
console.log(s.toUpperCase());  // "ABCDEF"
```

This generic function **now only accepts matching types**:

```ts
logLengthAndReturn(42);
//                 ^^ ERROR!
// Argument of type '42' is not assignable to parameter of type 'WithLength'.
```



## Decorators

<!-- slide-front-matter class: center, middle -->

Modify existing classes.



### What is a decorator?

Decorators are an experimental feature ([stage 2 proposal][js-decorators-proposal]) of JavaScript that is available in TypeScript.

They provide a way to add **annotations** to class declarations, methods, accessors, properties and parameters.
An annotation takes the form `@expression`, where `expression` must evaluate to a function that will be called at runtime with information about the decorated declaration.

```ts
`@classDecorator`
class Person {
  constructor(private name: string) {}

  `@methodDecorator`
  getName() {
    return this.name;
  }
}
```

Any function can be used as a decorator by applying it with `@` before a class, method, accessor, property or parameter.
In this example, we **decorate a class**

### Class decorator example

Class decorators can be used to apply **modifications to an existing class** and return the updated class.

For example, this is used in the [Angular][angular] framework to add functionality to **component classes**:

```ts
*@Component({
* selector: 'greet',
* template: '<strong>Hello {{ name }}!</strong>'
*})
class GreetComponent {
  name: string = 'World';
}
```

In this example, the decorator defines that `GreetComponent` is used with the `<greet>` tag and specifies its HTML template.

[angular]: https://angular.io
[js-decorators-proposal]: https://github.com/tc39/proposal-decorators
[typescript]: https://www.typescriptlang.org
[typescript-enums]: https://www.typescriptlang.org/docs/handbook/enums.html
[typescript-handbook]: https://www.typescriptlang.org/docs/handbook/basic-types.html
