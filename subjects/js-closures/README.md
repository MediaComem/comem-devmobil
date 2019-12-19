# JavaScript Closures

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
- [References](#references)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## THIS!.. IS!.. CLOSURE!

<runkit></runkit>

Consider this example:

```javascript
function makeLeader() {
  let city = 'Sparta';
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
  let city = "Sparta";
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
  for (let nb = 1; nb < 11; nb++) {
    let soldier = function() { // soldier function that logs the soldier's number
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
*for (let nb = 1; nb < 11; nb++) {
  let soldier = function() {
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
  for (let nb = 1; nb < 11; nb++) {
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


## References

**Documentation**

* [MDN - Closures][closure]



[chrome]: https://www.google.com/chrome/
[closure]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
[closure-loop-bug-codepen]: http://codepen.io/AlphaHydrae/pen/gmYQpN?editors=0010#0
