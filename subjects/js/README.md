# JavaScript

<!-- slide-front-matter class: center, middle -->

## Summary

<runkit global enabled='false'></runkit>

Learn the basics of JavaScript, a high-level, dynamic, untyped and interpreted programming language,
and one of the three core technologies of the web.

<!-- slide-include ../../BANNER.md -->

**You will need**

- [Google Chrome][chrome] (recommended, any browser with developer tools will do)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Setup](#setup)
- [What is JavaScript?](#what-is-javascript)
  - [JavaScript is still evolving](#javascript-is-still-evolving)
  - [JavaScript ES6+ support](#javascript-es6-support)
- [JavaScript types](#javascript-types)
  - [JavaScript has 6 primitive data types](#javascript-has-6-primitive-data-types)
  - [JavaScript has **dynamic** objects](#javascript-has-dynamic-objects)
  - [Array are **objects**](#array-are-objects)
  - [JavaScript is **untyped**](#javascript-is-untyped)
  - [Comparing values with `==` or `===`](#comparing-values-with--or-)
  - [Falsy values](#falsy-values)
- [JavaScript supports first-class functions](#javascript-supports-first-class-functions)
  - [Storing functions in variables or data structures](#storing-functions-in-variables-or-data-structures)
  - [Returning functions from a function](#returning-functions-from-a-function)
  - [Passing functions as arguments](#passing-functions-as-arguments)
    - [Function as argument exercise](#function-as-argument-exercise)
  - [Transforming data with functions](#transforming-data-with-functions)
  - [Arrow functions _(ES6+)_](#arrow-functions-_es6_)
    - [Arrow function arguments](#arrow-function-arguments)
    - [Body of arrow functions](#body-of-arrow-functions)
- [Constructors](#constructors)
  - [The `this` keyword](#the-this-keyword)
- [Variables](#variables)
  - [Defining variables](#defining-variables)
  - [Dynamic or constant variables](#dynamic-or-constant-variables)
  - [The function scope](#the-function-scope)
  - [The block scope](#the-block-scope)
  - [The (evil) global scope](#the-evil-global-scope)
    - [When it's okay to use the global scope](#when-its-okay-to-use-the-global-scope)
    - [Oops, global scope](#oops-global-scope)
- [String syntax](#string-syntax)
- [Manipulating arrays](#manipulating-arrays)
  - [Examples](#examples)
  - [The `for...of` loop](#the-forof-loop)
- [Destructuring assignment](#destructuring-assignment)
  - [Array destructuring](#array-destructuring)
    - [Array destructuring features & tricks](#array-destructuring-features--tricks)
  - [Object destructuring](#object-destructuring)
    - [Object destructuring features & tricks](#object-destructuring-features--tricks)
- [JSON](#json)
  - [JSON who?](#json-who)
  - [Example](#example)
  - [Using JSON](#using-json)
- [Resources](#resources)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Setup

To follow along the exemples in this subject, create a new folder, e.g. `js`, on you `dfa-course` project.

Create two file in this new folder: `index.html` and `script.js`.

Then add the following in the `index.html` file:

```html
<head>
  <script src="script.js"></script>
</head>
```
Start `live-server` and display your browser's console (since we won't need the webpage).

> Feel free to remove all code from `script.js` each time you want to try one of this subject's examples.

## What is JavaScript?

<!-- slide-front-matter class: center, middle -->

> JavaScript is a high-level, **dynamic**, **untyped**, and interpreted programming language.
> Alongside HTML and CSS, JavaScript is one of the three core technologies of World Wide Web.

> JavaScript is **prototype**-based with **first-class functions**, making it a multi-paradigm language, supporting **object-oriented**, **imperative**, and **functional** programming styles.

### JavaScript is still evolving

It has been standardized in the [ECMAScript][es] language specification.

<p class="center"><img src='images/timeline.png' width='60%' /></p>

- [**ECMAScript 2015** (also known as ECMAScript 6 or ES6)][es6] added an enormous amount of new (drastic) features : iterators and for/of loops, Python-style [generators][js-generators] and generator expressions, [arrow functions][js-arrow-functions], binary data, typed arrays, collections (maps, sets and weak maps), [promises][js-promise], number and math enhancements, reflection, and [proxies][js-proxy].
  > Since this huge release, it has been decided to make smaller and more frequent releases
- [**ECMAScript 2017** (ES8)][es8] added [async/await functions][js-async] and [shared memory and atomics][js-shared-memory].
- [**ECMAScript 2018** (ES9)][es9] added [asynchronous iteration][js-async-iteration] and more.
- And so on...

### JavaScript ES6+ support

Many features of ES6 are **supported by [the majority of modern browsers][caniuse-es6]**.

This means that you could use them directly in JavaScript code running in the **browser**.

If your user base might not have **up-to-date browsers** or ones that do not support those features, you should stick to **ES5** or use a JavaScript compiler like [Babel][babel] or a module bundler like [Webpack][webpack]
to turn your ES6+ code into compatible ES5 code before releasing it.

In server-side code running with the latest **Node.js** versions,
all **ES6+** features are supported except for [imports][js-imports].

> JavaScript examples in this course will use ES6 features when applicable

## JavaScript types

<!-- slide-front-matter class: center, middle -->

### JavaScript has 6 primitive data types

<!-- slide-column 70 -->

```js
let aString = "HEIG-VD";
let aNumber = 3.12;
let aBoolean = true;
let nullValue = null;
let undefinedValue;
let aSymbol = Symbol("foo");

console.log(typeof aString); // "string"
console.log(typeof aNumber); // "number"
console.log(typeof aBoolean); // "boolean"
console.log(typeof nullValue); // "object"
console.log(typeof undefinedValue); // "undefined"
console.log(typeof aSymbol); // "symbol"

// There is no integer type
console.log(Number.isInteger(aNumber)); // false
console.log(typeof 4); // "number"
console.log(Number.isInteger(4)); // true

// Symbols are unique identifiers
console.log(Symbol("foo") == aSymbol); // false
```

<!-- slide-column 30 -->

The types are:

- String
- Number
- Boolean
- Null
- Undefined
- Symbol (**ES6**)

<!-- slide-column 100 -->

> Note that `null` is a type, but `typeof null === object`.
> This is a [remnant][js-typeof-null] from the first version of JavaScript.

### JavaScript has **dynamic** objects

<!-- slide-column 60 -->

```js
// Let's create an object
let person = {
  firstName: "John",
  lastName: "Doe",
};

// We can dynamically add properties
person.gender = "male";

let property = "zip";
person[property] = 1446;

// And delete them
delete person.firstName;

// And list them
for (const key in person) {
  console.log(key + ": " + person[key]);
}
```

```txt
lastName: John
gender: male
zip: 1446
```

<!-- slide-column 40 -->

Objects have **no class**, they are **dynamic bags** of properties.

Every object has a **different list of properties**.

### Array are **objects**

They are list-like objects with numeric keys.

```js
// Let's create an array
let fruits = ["apple", "pear"];

console.log(typeof fruits); // "object"

// Iterate over it
for (let i = 0; i < fruits.length; i++) {
  console.log("fruit " + i + " is " + fruits[i]);
}

// fruit 0 is apple
// fruit 1 is banana
```

We'll learn more about arrays later.

### JavaScript is **untyped**

Values have a type, but **variables don't**.
When you declare a variable, you don't specify a type.

```js
let aVariable = "aString";
console.log(typeof aVariable); // "string"

aVariable = 3.12;
console.log(typeof aVariable); // "number"

aVariable = true;
console.log(typeof aVariable); // "boolean"

aVariable = [1, 2, 3];
console.log(typeof aVariable); // "object"

aVariable = {
  aProperty: "aValue",
};
console.log(typeof aVariable); // "object"
```

The type can **change** over time.

### Comparing values with `==` or `===`

The `==` operator **loosely** compares values for equality:

```js
console.log(1 == true); // true
console.log(2.3 == "2.3"); // true
console.log(false == []); // true
```

The `===` operator **strictly** compares for equality:

```js
console.log(1 === true); // false
console.log(2.3 === "2.3"); // false
console.log(false === []); // false
console.log(42 === 42); // true
```

### Falsy values

The following values all **evaluate to false**: `false`, `0`, `""`, `null`, `undefined`, `NaN`.

```js
if (0) {
  console.log("Zero is truthy");
} else {
  console.log("Zero is falsy"); // "Zero is falsy"
}
```

This can cause weird bugs sometimes:

```js
let countdown = "";
if (countdown == 0) {
  console.log("We are done"); // "We are done"
} else {
  console.log("We are not done");
}
```

Therefore, it's recommended to always use the triple-equal `===` operator for equality comparisons.

## JavaScript supports first-class functions

<!-- slide-front-matter class: center, middle -->

> "A programming language is said to have [first-class functions][first-class-functions] if it treats functions as first-class citizens.

> Specifically, this means the language supports **passing functions as arguments** to other functions, **returning them** as the values from other functions, and **assigning them to variables** or **storing them in data structures**."

### Storing functions in variables or data structures

A JavaScript function isn't a special construct linked to a class like in Java.
It can be stored in variables like any other value.

```js
// Store a function in a variable
let hello = function (name) {
  console.log("Hello " + name + "!");
};

// The hello variable now holds a function
console.log(typeof hello); // "function"

// You can call it
hello("World"); // "Hello World!"

// Store a function as an object's property
let anObject = {
  aProperty: function () {
    return 42;
  },
};

// That property now holds a function as its value
console.log(typeof anObject.aProperty); // "function"

let value = anObject.aProperty();
console.log(value); // 42
```

### Returning functions from a function

```js
// Let's define a function that returns a function
function makeSquareFunction() {
  return function (n) {
    return n * n;
  };
}

// By calling it, we get a function
let square = makeSquareFunction();
console.log(typeof square); // "function"

let result = square(5);
console.log(result); // 25
```

<!-- <runkit except='1'></runkit> -->

Note that functions can be **anonymous** (i.e. they have no name),
like the function returned from `makeSquareFunction`:

```js
return function (n) {
  return n * n;
};
```

### Passing functions as arguments

A function can take another function as an argument.

```js
function hello(name) {
  console.log("Hello " + name + "!");
}

function callIt(func) {
  func("World");
}

callIt(hello); // "Hello World!"
```

#### Function as argument exercise

Copy the following code in your `script.js` file and try to **implement it**:

```js
// Let's define a couple of arithmetic function
function add(a, b) {
  return a + b;
}
function multiply(a, b) {
  return a * b;
}

// Give me some arguments and implement me!
function compute(/* TODO */) {
  // TODO
}

// Call compute with "add"
let value = compute(2, 4, add);
console.log(value);

// Call compute with "multiply"
value = compute(2, 4, multiply);
console.log(value);
```

<!-- slide-column -->
**Current result**

```
undefined
undefined
```
<!-- slide-column -->
**Expected result**

```
6
8
```

<!-- Open the **RunKit** and try to **implement it**! -->

### Transforming data with functions

These properties of functions enable powerful [**functional programming**][func-prog] patterns:

```js
// Define an array of people objects
let people = [
  { firstName: "John", lastName: "Doe" },
  { firstName: "John", lastName: "Smith" },
  { firstName: "Deborah", lastName: "Smith" },
];

// Define a function that takes a person and returns their last name
function getName(person) {
  return person.lastName;
}

// The "map" function of arrays returns an array of the same size,
// but with each element "mapped" or "transformed" using the provided
// function
let lastNames = people.map(getName);

// We transformed an array of people into an array of last names
console.log(lastNames); // [ "Doe", "Smith", "Smith" ]
```

### Arrow functions _(ES6+)_

<runkit disabled></runkit>

While seaching for examples on the web, you will stumble upon a strange syntax:

```js
let divideFunc = (nb1, nb2) => nb1 / nb2;
```

You are facing the **ES6** syntax for functions called **arrow functions**.
The example above is (mostly) equivalent to writing:

```js
let divideFunc = function (nb1, nb2) {
  return nb1 / nb2;
};
```

#### Arrow function arguments

<runkit except='0,1'></runkit>

Let's see how an arrow function is written:

```js
`(nb1, nb2)` => nb1 / nb2
```

The part left of the `=>` represents the **function's arguments**.

If your function has **only one** argument, you can **omit** the parentheses:

```js
let squareroot = `number` => Math.sqrt(number);
```

But if your function has **no arguments**, you **MUST** add **empty parentheses**:

```js
// No argument
let callback = `()` => console.log("Timeout finished");
setTimeout(callback, 1000);
```

> As a rule of thumb, you should always use brackets.

#### Body of arrow functions

<runkit except='0'></runkit>

```js
(nb1, nb2) => `nb1 / nb2`;
```

The part right of the `=>` is **the body** of the function; note the absence of brackets (`{}`).

The `return` keyword is **implicit** with one-line bodies that have no brackets:

```js
// This arrow function will return the square root of the number
const squareroot = (number) => `Math.sqrt(number)`;
console.log(squareroot(4)); // 2
```

If the body has **more than one line**, you **MUST add brackets** `{}` around it (_and use the `return` keyword if necessary_):

```js
const square = (number) =>
  `{``let result = number * number;``return result;``}`;

console.log(square(5)); // 25
```

## Constructors

Though JavaScript doesn't really have classes _per se_, any function can behave like a **constructor** and create an object.

For a function to act as a constructor, you don't have to declare it differently than any other function.
All you have to do is call the function with `new` like in most object-oriented languages:

```js
function Starship() {}

let discovery = new Starship();
console.log(discovery); // {}
console.log(discovery instanceof Starship); // true
```

The `discovery` variable stores a new (and empty) object, of type `Starship`.

> Note that there's **nothing special** about this function: calling it with `new` is what makes it a constructor.
>
> It's simply a **convention** to put the first letter in uppercase.

### The `this` keyword

You can access the `this` keyword inside a function body. In this case, `this` refers to **the object that will be created** when calling this function as a **constructor** (with `new`).

You can modify this object, for example to attach it properties with values received as parameters:

```js
function Starship(name, designation) {
* this.name = name;
* this.designation = designation;
}

let discovery = new Starship("Discovery", "NCC-1031");
console.log(discovery);
// Starship {name: "Discovery", designation: "NCC-1031"}
```

> It's possible to implement class-like structures with **constructor functions** and **prototypes**.
>
> JavaScript **ES6** adds a new sytax for **classes** that looks very much like what you could find in Java, although the underlying mechanisms are still based on **prototypes**.
> But that's outside the scope of this tutorial.

## Variables

<!-- slide-front-matter class: center, middle -->

### Defining variables

<runkit disabled></runkit>

There are three ways to define a variable in JavaScript:

```js
// ES5
var aString = "foo";

// ES6
let aNumber = 42;
const aBoolean = true;
```

Note that `var` is valid whatever the ES version you're using, but `let` and `const` are only available in **ES6** and later versions.

### Dynamic or constant variables

Variables declared with `var` or `let` are dynamic.
Their value can **change** over time.

```js
var aString = "foo";
let aNumber = 24;

console.log(aString); // "foo"
console.log(aNumber); // 24

aString = "bar";
aNumber = 25;

console.log(aString); // "bar"
console.log(aNumber); // 25
```

Variables declared with `const` cannot change.
They are **constants**:

```js
const theMeaningOfLife = 42;

theMeaningOfLife = 43; // TypeError: Assignment to constant variable.
```

### The function scope

Variables declared with `var` in a function are visible **everywhere in that function**.
Note that they are **NOT block-scoped** like in most languages.

```js
function logThings(things) {
  var numberOfThings = things.length;

  for (var i = 0; i < numberOfThings; i++) {
    var thing = things[i];
    console.log(thing);
  }

  console.log("Number of things: " + numberOfThings);
  console.log("Last thing: " + thing);
  console.log("Iterator: " + i);
}

logThings(["apple", "banana", "pear"]);

// "apple"
// "banana"
// "pear"
// "Number of things: 3"
// "Last thing: pear"
// "Iterator: 3"
```

### The block scope

The `let` and `const` keywords introduced in **ES6** create **block-scoped** variables,
only visible in the block, statement or expression on which they are used.

```js
function logThings(things) {
  const numberOfThings = things.length;

  for (let i = 0; i < numberOfThings; i++) {
    let thing = things[i];
    console.log(thing);
  }

  console.log("Number of things: " + numberOfThings);
  console.log("Last thing: " + thing);
}

logThings(["apple", "banana", "pear"]);

// "apple"
// "banana"
// "pear"
// "Number of things: 3"
// ReferenceError: thing is not defined
```

**It is recommended to use them in ES6-compatible environments**.

### The (evil) global scope

Variables declared with `var` outside of any function are **global variables**, accessible anywhere.

```js
// A global variable
var name = "World";

function hello() {
  // We can use "name" even though it's not an argument
  // of the function, because it's global
  console.log("Hello " + name + "!");

  // It's a bad idea to use them because anyone can
  // change their value and mess up your program
  name = "Bob";
}

hello(); // "Hello World!"
hello(); // "Hello Bob!"
```

You should **almost never use them**.

#### When it's okay to use the global scope

In an **HTML page**, all loaded scripts share the same global scope.

In that context, ES5 libraries expose global variables so that your code can use them.
For example, jQuery provides the **`$`** global variable for easy access.

In a **Node.js script**, the global scope is limited to the file you're in, so it's okay to use it.

If you're not writing either one of those, just **don't use global variables**.

#### Oops, global scope

If you forget the `var`, `let` or `const` keyword, JavaScript will not complain.
It will simply consider the variable global.

```js
// Let's declare a global variable
var i = 42;

// And a function that logs each thing in the passed array
function logThings(things) {
  // Oops, we forgot the "var" or "let"
* for (i = 0; i < things.length; i++) {
    console.log(things[i]);
  }
}

var fruits = [ 'apple', 'banana', 'pear' ];
logThings(fruits);

// Oops, we've modified something outside of the function
console.log(i); // 3
```

Just **don't do it**.

## String syntax

<runkit disabled></runkit>

In JavaScript, you have 3 ways of declaring strings:

```js
// With single quotes: '
let string = 'I\'m your "Wurst" nightmare: ' + worstNightmare;
```

> You have to **escape all other single quotes**, and use `+` to concatenate.

```js
// With double quotes: "
let string = 'I\'m your "Wurst" nightmare: ' + worstNightmare;
```

> You have to **escape all other double quotes**, and use `+` to concatenate.

**ES6** also adds the new **template literals**:

```js
// With backticks (template literals): `
let string = \`I'm your "Wurst" nightmare: ${worstNightmare}`;
```

You have to escape all other backticks, but you can use single and double quotes without escaping.

Expressions included as `${expression}` will be evaluated then concatenated.

## Manipulating arrays

Arrays in JavaScript are objects and provide you with a [boatload of methods][array-functions] to manipulate items:

| Function     | Effect                                                                                                                    |
| :----------- | :------------------------------------------------------------------------------------------------------------------------ |
| `.forEach()` | Calls a function for every element in the array                                                                           |
| `.concat()`  | Concatenates two arrays into one, and returns this new array                                                              |
| `.find()`    | Finds the **first** element that passes a provided test function                                                          |
| `.pop()`     | Removes the **last** element, and returns it (`.shift()` does the same but for the **first** element)                     |
| `.push()`    | Adds new elements to **the end** of an array (`.unshift()` does the same but adds them to the **beginning** of the array) |
| `.slice()`   | Returns **a portion** of the array                                                                                        |
| `.reverse()` | Reverses the order of the elements in an array (**this modifies the original array**)                                     |

### Examples

`.forEach()`

```js
let crew = ["Jonathan", "T'Pol", "Trip", "Malcolm", "Sato", "Travis"];
crew.forEach(function (element, index) {
  console.log("Hello, my name is " + element + ", and I'm n°" + index);
});
```

`.find()`

```js
let ages = [3, 10, 19, 25];
let adult = ages.find(function (age) {
  return age >= 18;
});
console.log(adult); // 19
```

`.slice()`

```js
let starships = ["NX-01", "NCC-1701", "NCC-1701 D", "NCC-1764", "NCC-74656"];
// Start at position 0, included, and end before position 3, excluded.
let enterprises = starships.slice(0, 3);
console.log(enterprises); // ["NX-01", "NCC-1701", "NCC-1701 D"]
```

### The `for...of` loop

**ES6**'s `for...of` loop is a new, simpler way of **iterating over all elements** of an array:

```js
let fruits = ["apple", "pear"];

// Classic "for" loop
for (let i = 0; i < fruits.length; i++) {
  let fruit = fruits[i];
  console.log("fruit: " + fruit);
}

// Equivalent "for...of" loop
for (let fruit of fruits) {
  console.log("fruit: " + fruit);
}
```

The `for...of` loop is actually not limited to arrays:
it can iterate over any [iterable object][js-iterable] such as Map, Set, etc.

## Destructuring assignment

<!-- slide-front-matter class: center, middle -->

The destructuring assignment syntax makes it possible to **unpack values from arrays**, or **properties from objects**, into **distinct variables**.

### Array destructuring

<!-- slide-column 50 -->

Basic variable assignment.

```js
let foo = [ 'one', 'two', 'three' ];

*let [ one, two, three ] = foo;
console.log(one); // "one"
console.log(two); // "two"
console.log(three); // "three"
```

<!-- slide-column 50 -->

Equivalent without destructuring.

```js
let foo = [ 'one', 'two', 'three' ];

*let one = foo[0];
*let two = foo[1];
*let three = foo[2];
console.log(one); // "one"
console.log(two); // "two"
console.log(three); // "three"
```

<!-- slide-column 100 -->

You can also use destructuring separately from the variables' declaration:

```js
let foo = [ 'one', 'two', 'three' ];
let one, two, three;

*[ one, two, three ] = foo;
console.log(one); // "one"
console.log(two); // "two"
console.log(three); // "three"
```

#### Array destructuring features & tricks

Here's a few things you can do with array destructuring:

```js
// Default values
let a, b;
*[ a=5, b=7 ] = [ 1 ];
console.log(a); // 1
console.log(b); // 7

// Swapping variables
let c = 1;
let d = 3;
*[c, d] = [d, c];
console.log(c); // 3
console.log(d); // 1

// Ignoring values
*let [ e, f ] = [ 'foo', 'bar', 'baz' ];
console.log(e); // "foo"
console.log(f); // "bar"

// Assigning the rest to a variable
*let [ g, ...h ] = [ 1, 2, 3 ];
console.log(g); // 1
console.log(h); // [2, 3]
```

### Object destructuring

<!-- slide-column 50 -->

Basic variable assignment.

```js
let o = { p: 42, q: true };

*let { p, q } = o;
console.log(p); // 42
console.log(q); // true
```

<!-- slide-column 50 -->

Equivalent without destructuring.

```js
let o = { p: 42, q: true };

*let p = o.p;
*let q = o.q;
console.log(p); // 42
console.log(q); // true
```

<!-- slide-column 100 -->

You can also use destructuring separately from the variables' declaration
(but you have to put it within parentheses):

```js
let o = { p: 42, q: true };
let p, q;

*({ p, q } = o);
console.log(p); // 42
console.log(q); // true
```

#### Object destructuring features & tricks

Here's a few things you can do with object destructuring:

```js
// Assigning to new variable names
let o = { p: 42, q: true };

*let { p: foo, q: bar } = o;
console.log(foo); // 42
console.log(bar); // true

// Default values
*let { a = 10, b = 5 } = { a: 3 };
console.log(a); // 3
console.log(b); // 5

// Unpacking fields from function parameters
*function userId({id}) {
  return id;
}

let user = { id: 42, name: 'Bob' };
console.log('userId: ' + userId(user)); // "userId: 42"
```

## JSON

<!-- slide-front-matter class: center, middle -->

### JSON who?

[JSON][json] stands for **J**ava**S**cript **O**bject **N**otation.
It is a syntax that is used to **represent JavaScript objects** with **text**.

JSON can only describe the following types:

| Types   | Notation                                           |
| :------ | :------------------------------------------------- |
| String  | `"text"`                                           |
| Number  | `2`                                                |
| Boolean | `true`, `false`                                    |
| Null    | `null`                                             |
| Array   | `[ "value1", "value2" ]`                           |
| Object  | `{ "property1": "value1", "property2": "value2" }` |

Object properties and strings **MUST be double-quoted**.

Note that you **cannot** put a JavaScript function in a JSON object.

### Example

Here is an example of a **JavaScript object**, and its **description in JSON**:

<!-- slide-column -->

```js
let starship = {
  designation: "NX-01",
  crew: 83,
  captain: {
    firstname: "Jonathan",
    lastname: "Archer",
    activeService: true
  },
  species: [
    "human",
    "dog",
    "denobulan",
    "vulcan"
  ],
* "warp.factor": 5,
* "cloak": null
};
```

This is a JavaScript object.
You _can_ put double quotes around property names, but you don't **have to**
unless it's an **invalid identifier** (e.g. cannot use `.` in a variable name).

<!-- slide-column -->

```json
{
  "designation": "NX-01",
  "crew": 83,
  "captain": {
    "firstname": "Jonathan",
    "lastname": "Archer",
    "activeService": true
  },
  "species": ["human", "dog", "denobulan", "vulcan"],
  "warp.factor": 5,
  "cloak": null
}
```

This is JSON. The double quotes around property names are **required**.

### Using JSON

**Manually** declaring a JavaScript object in JSON (or the opposite) can be quite tedious, especially with deep, complex objects.

Fortunately, JavaScript provides the **global `JSON` object** which can do it for you.
To transform a **JavaScript object to JSON text**, use `JSON.stringify()`:

```js
let crew = {name: "T'Pol", species: "Vulcan", station: "Science Officer"};
*let crewJson = JSON.stringify(crew);
console.log(crewJson);
// "{"name":"T'Pol","species":"Vulcan","station":"Science Officer"}"
```

To do the opposite, that is create a JavaScript object from JSON text, use `JSON.parse()`:

```js
let crewJson = '{"name": "Travis", "species": "Human", "station": "Helm"}';
*let crew = JSON.parse(crewJson);
console.log(crew);
// Object {name: "Travis", species: "Human", station: "Helm"}
```

## Resources

- A re-introduction to JavaScript
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript
- Inheritance and the prototype chain
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain
- Introduction to Object-Oriented JavaScript
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
- JavaScript objects in detail
  http://javascriptissexy.com/javascript-objects-in-detail
- Complete list of native Array methods
  https://www.w3schools.com/jsref/jsref_obj_array.asp

[caniuse-es6]: https://caniuse.com/#search=es6
[array-functions]: https://www.w3schools.com/jsref/jsref_obj_array.asp
[babel]: http://babeljs.io
[chrome]: https://www.google.com/chrome/
[es]: https://en.wikipedia.org/wiki/ECMAScript
[es6]: http://es6-features.org/
[es8]: http://2ality.com/2016/02/ecmascript-2017.html
[es9]: http://2ality.com/2017/02/ecmascript-2018.html
[es2019]: http://2ality.com/2018/02/ecmascript-2019.html
[es2020]: https://2ality.com/2019/12/ecmascript-2020.html
[ex-function-as-argument]: http://codepen.io/AlphaHydrae/pen/dNBpPv?editors=0010
[first-class-functions]: https://en.wikipedia.org/wiki/First-class_function
[func-prog]: https://en.wikipedia.org/wiki/Functional_programming
[js-arrow-functions]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
[js-async]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
[js-async-iteration]: http://2ality.com/2016/10/asynchronous-iteration.html
[js-destructuring-assignment]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
[js-generators]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
[js-imports]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
[js-iterable]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
[js-loops]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration
[js-promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[js-proxy]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
[js-shared-memory]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer
[js-typeof-null]: http://www.2ality.com/2013/10/typeof-null.html
[js-symbol]: https://developer.mozilla.org/en-US/docs/Glossary/Symbol
[json]: http://www.json.org/
[foreach-doc]: https://www.w3schools.com/jsref/jsref_forEach.asp
[concat-doc]: https://www.w3schools.com/jsref/jsref_concat_array.asp
[find-doc]: https://www.w3schools.com/jsref/jsref_find.asp
[pop-doc]: https://www.w3schools.com/jsref/jsref_pop.asp
[push-doc]: https://www.w3schools.com/jsref/jsref_push.asp
[slice-doc]: https://www.w3schools.com/jsref/jsref_slice_array.asp
[reverse-doc]: https://www.w3schools.com/jsref/jsref_reverse.asp
[webpack]: https://webpack.js.org/
