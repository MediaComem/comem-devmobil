# JavaScript Classes

<!-- slide-front-matter class: center, middle -->

## Summary

Learn about JavaScript classes (ES6+).

<!-- slide-include ../../BANNER.md -->

**You will need**

* [Google Chrome][chrome] (recommended, any browser with developer tools will do)

**Recommended reading**

* [JavaScript][subject-js]
* [JavaScript Prototypes][subject-js-prototypes]

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [What are JavaScript classes?](#what-are-javascript-classes)
- [The new class syntax](#the-new-class-syntax)
  - [Syntactical sugar](#syntactical-sugar)
- [Static methods](#static-methods)
- [Sub-classing](#sub-classing)
  - [Using `super` in the constructor](#using-super-in-the-constructor)
  - [Using `super` in methods](#using-super-in-methods)
- [Getters and setters](#getters-and-setters)
- [Resources](#resources)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## What are JavaScript classes?

<!-- slide-front-matter class: center, middle -->

> Classes are one of the [features added by ECMAScript 2015 (or ES6)][es6].

> It's important to note that the new class syntax **does NOT introduce a new inheritance model to JavaScript**.
> It is simply syntactical sugar over JavaScript's existing [**prototype-based inheritance**][subject-js-prototypes].



## The new class syntax

<runkit></runkit>

<!-- slide-column 35 -->

Here's an example of how to define a basic class with **properties**, a **constructor function** and a **method**.

Note the new `class` and `constructor` keywords,
and the ability to define methods without the `function` keyword.

<!-- slide-column -->

```js
`class` Rectangle {
  `constructor`(height, width) {
    this.height = height;
    this.width = width;
  }

  `computeArea`() { // No "function" keyword here
    return this.width * this.height;
  }
}

const r = `new Rectangle`(20, 40);
console.log(r.computeArea()); // 800
```

<!-- slide-container -->

<!-- slide-column 35 -->

Also note that this is just a **syntax shortcut**.
There is no real class system in JavaScript.

In fact, the class declaration above is equivalent to this one:

<!-- slide-column -->

```js
function Rectangle(height, width) {
  this.height = height;
  this.width = width;
}

Rectangle.prototype.computeArea = function() {
  return this.width * this.height;
};

const r = new Rectangle(20, 40);
console.log(r.computeArea()); // 800
```



### Syntactical sugar

<runkit></runkit>

Here's a few checks to show you that the new class syntax is just another way to use JavaScript's **existing prototypal inheritance system**:

```js
// Define a "class".
class Rectangle {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }

  computeArea() {
    return this.width * this.height;
  }
}

// "Rectangle" is just a function, not some special class construct.
console.log(typeof(Rectangle)); // "function"

// It has an associated prototype object, like any function.
console.log(typeof(Rectangle.prototype)); // "object"
console.log(typeof(Rectangle.prototype.computeArea)); // "function"

// Instances constructed with it are linked to the
// function's prototype object, as expected.
const r = new Rectangle(20, 40);
console.log(Object.getPrototypeOf(r) === Rectangle.prototype);
```



## Static methods

<runkit></runkit>

The `static` keyword defines a static method for a class.
Static methods are called without instantiating their class and cannot be called through a class instance:

```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  `static` distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
  }
}

const p1 = new Point(5, 5);
const p2 = new Point(10, 10);

console.log(`Point.distance`(p1, p2)); // 7.0710678118654755
console.log(p1.distance(p1, p2)); // TypeError: p1.distance is not a function
```

Static methods are often used to create utility functions for an application.



## Sub-classing

<runkit></runkit>

The `extends` keyword allows you to easily create a sub-class of another class.
You can **override methods** of the super-class by simply redefining them:

```js
class Person {
  constructor(first, last) {
    this.first = first;
    this.last = last;
  }

  greet() {
    console.log(\`Hello, I'm ${this.first} ${this.last}`);
  }
}

class SecretAgent `extends` Person {
* greet() {
*   console.log(\`My name is ${this.last}, ${this.first} ${this.last}`);
* }
}

const p = new Person('John', 'Doe');
p.greet(); // "Hello, I'm John Doe"

const jb = new SecretAgent('James', 'Bond');
jb.greet(); // "My name is Bond, James Bond"
```



### Using `super` in the constructor

<runkit></runkit>

If both sub-class and super-class have a constructor,
the sub-class's constructor **MUST** call `super` as its first statement, which executes the super-class's constructor:

```js
class Cat {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(this.name + ' makes a noise.');
  }
}

class Lion `extends` Cat {
  constructor(name) {
*   super(\`Big ${name}`);
    this.claws = 18;
  }
}

var l = new Lion('Fuzzy');
l.speak();
// "Big Fuzzy makes a noise."
```



### Using `super` in methods

<runkit></runkit>

You can use `super` in a sub-class to reference the super-class or call its methods:

```js
class Cat {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(this.name + ' makes a noise.');
  }
}

class Lion `extends` Cat {
  speak() {
*   super.speak();
    console.log(this.name + ' roars.');
  }
}

var l = new Lion('Fuzzy');
l.speak();
// "Fuzzy makes a noise."
// "Fuzzy roars."
```



## Getters and setters

<runkit></runkit>

You can also define [getters][js-get] and [setters][js-set] with the new class syntax:

```js
class Person {
  constructor(first, last) {
    this.first = first;
    this.last = last;
  }

* get full() {
*   return \`${this.first} ${this.last}`;
* }

* set full(value) {
*   const parts = value.split(' ');
*   this.first = parts[0];
*   this.last = parts[1];
* }
}

const p = new Person('John', 'Doe');
console.log(`p.full`); // "John Doe"

`p.full = 'Bob Smith'`;
console.log(`p.full`); // "Bob Smith"
```



## Resources

**Documentation**

* [JavaScript Classes][js-classes]

**Further reading**

* [Better JavaScript with ES6, Pt. II: A Deep Dive into Classes](https://scotch.io/tutorials/better-javascript-with-es6-pt-ii-a-deep-dive-into-classes)
* [Classes in ECMAScript 6 (final semantics)](http://2ality.com/2015/02/es6-classes-final.html)
* [Exploring JS: Classes](http://exploringjs.com/es6/ch_classes.html)



[chrome]: https://www.google.com/chrome/
[es6]: http://es6-features.org/
[js-classes]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
[js-get]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
[js-set]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set
[subject-js]: ../js/
[subject-js-prototypes]: ../js-prototypes/
