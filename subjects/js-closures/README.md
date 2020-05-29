# JavaScript Closures

<!-- slide-front-matter class: center, middle -->

## Summary

Learn what's a JavaScript closure, how to use them, and common pitfalls.

<!-- slide-include ../../BANNER.md -->

**You will need**

* [Google Chrome][chrome] (recommended, any browser with developer tools will do)

**Recommended reading**

* [JavaScript](../js/)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [THIS!.. IS!.. CLOSURE!](#this-is-closure)
  - [This is not...](#this-is-not)
- [Closures in loops](#closures-in-loops)
  - [Wait... what?](#wait-what)
  - [Doing it right](#doing-it-right)
  - [The revelation](#the-revelation)
  - [Doing it right - ES6 version](#doing-it-right---es6-version)
    - [But... WHY?! - `var`](#but-why---var)
    - [But... WHY?! - `let`](#but-why---let)
- [References](#references)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## THIS!.. IS!.. CLOSURE!

<runkit></runkit>

Consider this example:

```javascript
function makeLeader() {
  var city = 'Sparta';
* return function leader() {
*   console.log('This is... ' + city);
* };
};

const leonidas = makeLeader(); // Store a new leader() function
leonidas(); // "This is... Sparta"
```

> `leader()` is a **closure**: a function that has a reference to a variable declared in an outer scope (in this cas, the `city` variable).

When created, `leader()` functions will permanently keep a reference to the `city` variable, even after `makeLeader()`'s execution has completed.

Thus, when the `leader()` function is executed on the last line, it will use the latest value of the `city` variable and print it.

<!-- slide-notes -->

> In this example, `leader()` can access `city`, because both the function and the variable are declared **inside the same scope**, that of `makeLeader()`.

If you were to create another instance of `leader()`, say by adding this code:

```js
const gerard = makeLeader(); // Store a new leader() function
```

This new instance would also keep a reference to `city` (and print `"Sparta"` when called), but it would be a different `leader()` function than the one stored in the `leonidas` variable.
To be sure of that, do:

```js
console.log(gerard === leonidas); // false
```



### This is not...

<runkit></runkit>

For illustration purposes, let's rewrite the previous example like this.

```javascript
function makeLeader() {
  var city = "Sparta";
  return leader; // Return the leader() function declared below
};

function leader() {
  console.log(city);
};

const leonidas = leader() // Stores the leader() function
leonidas(); // ReferenceError: city is not defined
```

The code apparently didn't change that much; all we did was declare `leader()` outside of `makeLeader()`, and yet it's enough to _break everything_.

`city` is still declared in the scope of `makeLeader()`, but since `leader()` is declared **outside** this scope, it **cannot** access `city` anymore, resulting in a `ReferenceError` when executed.

<!-- slide-notes -->

Moreover, in this case, there is only one instance of `leader()`, that is created when the script is first executed.

To test it, let's add the same code as before:

```javascript
const gerard = makeLeader(); // Store a leader() function

console.log(gerard === leonidas) // true
```
Here, `leonidas` and `gerard` store the same `leader()` function.



## Closures in loops

<runkit></runkit>

Using closures inside a loop can result in a well-know bug _(and laptops being tossed out of windows, too)_.
Consider the following code:

```javascript
// Returns an array of 10 soldier() functions
function createArmy() {
  const generatedSoldiers = []; // Create the array
  for (var nb = 1; nb < 11; nb++) {
    const soldier = function() { // soldier function that logs the soldier's number
      console.log("I'm the soldier n°" + nb);
    };
    generatedSoldiers.push(soldier); // Store it in the array
  }
  return generatedSoldiers; // Return the array
};

const spartan = createArmy();

// Let's execute all the created functions
spartan.forEach(function(soldierFunc) {
  soldierFunc();
});
```
> What will be the output of this code, once executed (use the `RunKit` button)?

<!-- slide-notes -->

When we execute all the functions that have been created by the call to `createArmy()`, we could expect the first one to print `"I'm the soldier n°1"`, the second to print `"I'm the soldier n°2"` and so on, until the tenth, that would print `"I'm the soldier n°10"`.

Instead, all the functions will print `"I'm the soldier n°11"`...



### Wait... what?

In the previous example, the function stored in `soldier` is a **closure**: it has a reference to a variable declared in an outer scope.

In this case, `soldier` has a reference to the `nb` variable (declared in the `for` block).

```javascript
// ...
*for (var nb = 1; nb < 11; nb++) {
  const soldier = function() {
*   console.log("I'm the soldier n°" + nb);
  };
  // ...
}
// ...
```

Each of the 10 `soldier` functions will forever keep a **reference** to the `nb` variable... but not to its **value**.

The `soldier` functions will only check the value of `nb` **when they are executed**: that is **after** the `for` loop is finished.

> And at that time, `nb` will have a value of `11`.



### Doing it right

<runkit></runkit>

To solve this problem, we have to find a way to capture not a *reference* to `nb`, but **its value at the time each function is created**. Here is the correct code:

```javascript
*function makeSoldier(rank) { // soldier function factory
* return function soldier() {
*   console.log("I'm the soldier n°" + rank);
* };
*}

// Returns an array of 10 soldier() functions
function createArmy() {
  const generatedSoldiers = [];
  for (var nb = 1; nb < 11; nb++) {
*   generatedSoldiers.push(makeSoldier(nb));
  }
  return generatedSoldiers;
};

const spartan = createArmy();
spartan.forEach(function(soldierFunc) {
  soldierFunc();
});
```

> The `soldier()` function is still a **closure**, but it now references the `rank` variable, declared in the _signature_ of `makeSoldier()`.

### The revelation

We have introduced a **factory function**, `makeSoldier()`, which returns a new `soldier()` function when called:

```javascript
function makeSoldier(rank) {
  return function soldier() {
    console.log("I'm the soldier n°" + rank);
  };
}
```

The `rank` argument is a **local variable** that `soldier()` can access.

Each time the `for` loop calls `makeSoldier()`, the **current value** of `nb` is passed:

```javascript
for (var nb = 1; nb < 11; nb++) {
* generatedSoldiers.push(makeSoldier(nb));
}
```

When you pass a primitive value to a function in JavaScript, its **value** is passed, *not a reference* to the variable holding it.

So each `soldier()` function will keep a reference to its own `rank` variable, which had a different value at every iteration of the `for` loop.

### Doing it right - ES6 version

<runkit></runkit>

Since ES6, there's another way to avoid this reference issue that is much more straight-forward and doesn't required changing the code so much.

The solution is to use the `let` keyword instead of the `var` keyword:

```js
// Returns an array of 10 soldier() functions
function createArmy() {
  const generatedSoldiers = [];
  for (`let` nb = 1; nb < 11; nb++) {
    const soldier = function() {
      console.log("I'm the soldier n°" + nb);
    };
    generatedSoldiers.push(soldier);
  }
  return generatedSoldiers;
};

const spartan = createArmy();

spartan.forEach(function(soldierFunc) {
  soldierFunc();
});
```
> No need to create a factory function if you use the `let` keyword.

#### But... WHY?! - `var`

<runkit></runkit>

To undestand of changing the keyword solve the issue, it's important to understand the notion of variable scoping and how `let` and `var` handle this notion differently.

Using `var` to declare a variable makes it scoped to the **function** in which it is declared.

```js
function createArmy() {
  // ...
  for (`var nb` = 1; nb < 11; nb++) {
    // ...
  }
  console.log(nb);
};
createArmy();
```

In this case, the `var nb` variable declared in the `for` loop is scoped to the `createArmy()` function, meaning that it will be shared and visible by all the code inside this function.

#### But... WHY?! - `let`

<runkit></runkit>

On the other hand, the `let` keyword declares a variable that is scoped to the **block** in which it is declared.

A function is a block, all right, but an `if...else` is also a block, as well as a `for` loop.

```js
function createArmy() {
  // ...
  for (`let nb` = 1; nb < 11; nb++) {
    // ...
  }
  console.log(nb);
};
createArmy();
```
In this case, the `let nb` variable is scoped to **one specific iteration** of the `for` loop. Each iteration will have its own `nb` variable, with a different value each time (the first iteration will have `nb = 1` ; the second iteration, `nb = 2` ; and so on...), **thus fixing the closure issue**.

`nb` being scoped to the `for` loop means that **it does not exist outside of it** ; the code inside `createArmy()` but outside the `for` loop can neither _see_ the `nb` variable, nor _access_ it.

This is why executing the above code will result in a `ReferenceError`.

## References

**Documentation**

* [MDN - Closures][closure]
* [MDN - let][let]


[chrome]: https://www.google.com/chrome/
[closure]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
[let]: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Instructions/let
