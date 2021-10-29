# Promises - the basics

<!-- slide-front-matter class: center, middle -->

## Summary

<!-- slide-include ../../BANNER.md -->

Get an overview of the Promise API and how to use it to handle asynchronous operations.

> **Disclaimer**

> This subject is a condensend version of a more in-depth subject about Promises that you can consult [here][js-prom].

> Several sections are directly copied from this subject.

**Recommanded readings**

- [JavaScript][js-bas]

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Asynchronous callback styles](#asynchronous-callback-styles)
  - [What's wrong with that?](#whats-wrong-with-that)
  - [Callback hell example](#callback-hell-example)
  - [Flatten the pyramid of doom](#flatten-the-pyramid-of-doom)
  - [Flatten the pyramid of doom with promises](#flatten-the-pyramid-of-doom-with-promises)
- [What is a promise?](#what-is-a-promise)
- [Promises/A+ specification](#promisesa-specification)
  - [Basic example](#basic-example)
  - [Consuming a promise](#consuming-a-promise)
- [Basic promise behavior](#basic-promise-behavior)
  - [Promise callback syntax](#promise-callback-syntax)
  - [Promise callbacks are **optional**](#promise-callbacks-are-optional)
    - [Unhandled promise rejections](#unhandled-promise-rejections)
  - [Using `catch()`](#using-catch)
  - [Promise utilities](#promise-utilities)
  - [Chaining `.then()` calls](#chaining-then-calls)
  - [Chaining promises](#chaining-promises)
    - [Practical example](#practical-example)
- [Dive deeper](#dive-deeper)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Asynchronous callback styles

There are many asynchronous callback styles.
Some libraries like jQuery use **custom callbacks**:

```js
function onDone(data) {
  console.log("Data: " + data);
}
function onFail(xhr) {
  console.warn("Request failed");
}

$.get("http://example.com").done(onDone).fail(onFail);
```
> Although jQuery's ajax methods can also be used as Promises

Node.js imposes a well-defined **convention**:

```js
fs.readFile("hello.txt", "utf-8", function (err, result) {
  if (err) {
    return console.warn(err);
  }

  console.log(result);
});
```

### What's wrong with that?

An asynchronous operations that **depends on the result** of another asynchronous operation can only be executed **in the callback** of this first operation.

Asynchronous code using basics callbacks tend to be **nested** very deeply and be quite difficult to read and maintain, when doing multiple operations one after the other.

<!-- slide-column -->

This anti-pattern has been called **Callback Hell** or **Pyramid of Doom**.

> As the names suggest, it's something you'd want to avoid.

<!-- slide-column -->

<p class=center>
  <img src=images/callback-hell.png class=shadow />
</p>

### Callback hell example

Imagine that you want to do **3 sequential asynchronous operations** with a web service when a new user registers on your website:

- Register a new user
- Log in that user
- Retrieve statistics about that user

With jQuery, you could write it like this:

```js
$.post("/api/users", userData, function (createdUser) {
  $.post("/api/auth", userData, function (authData) {
    let query = { userId: createdUser.id, token: authData.token };
    $.get("/api/stats", query, function (statsData) {
      // Do something with statsData...
    });
  });
});
```

You have to **nest the callbacks** because AJAX requests are asynchronous.

This is pretty deep already, and we're not even handling errors yet.


### Flatten the pyramid of doom

You could mitigate the issue by separating the calls into isolated functions:

```js
`createUser`({ name: "foo", password: "test" });

function `createUser`(userData) {
  $.post("/api/users", userData, function (createdUser) {
    `authenticateUser`(createdUser);
  });
}

function `authenticateUser`(createdUser) {
  $.post("/api/auth", userData, function (authData) {
    `retrieveUserStats`(createdUser, authData);
  });
}

function `retrieveUserStats`(createdUser, authData) {
  let query = { userId: createdUser.id, token: authData.token };
  $.get("/api/stats", { userId: createdUser.id }, function (statsData) {
*   // Do something with statsData...
  });
}
```

But now you **don't see a clear call sequence** anymore.
You have to read the whole thing to know that `createUser` calls `authenticateUser`, which itself calls `retrieveUserStats`.
And we're **still not handling errors**.

### Flatten the pyramid of doom with promises

It just so happens that jQuery AJAX calls also **return promises**:

```js
function createUser(userData) {
  return $.post('/api/users', userData);
}

function authenticateUser(createdUser) {
  return $.post('/api/auth', userData).then(function(authData) {
    return { createdUser: createdUser, authData: authData };
  });
}

function retrieveUserStats(data) {
  let query = { userId: data.createdUser.id, token: data.authData.token };
  return $.get('/api/stats', { userId: createdUser.id });
}

*createUser()
* .then(authenticateUser)
* .then(retrieveUserStats)
* .then(function(statsData) {
*   // Do something with statsData
* }).catch(function(err) {
*   // Any error that occurred at any step in the chain ends up here
* });
```

## What is a promise?

<!-- slide-front-matter class: center, middle -->

<img src='images/promises-logo.png' />

> A promise represents the **eventual result of an asynchronous operation**.
> It is a placeholder into which the **successful result value or reason for failure** will materialize.

## Promises/A+ specification

Promises are another way to organize asynchronous code.

All promises follow the [Promises/A+ specification][promises-spec].
Promises have been integrated into the JavaScript language since ECMAScript 2015.

Basically, a promise is an object with a `then()` function that has the following signature:

```js
promise.then(onResolved, onRejected);
```

It takes **2 callback functions**:

- The **first** one is called when the asynchronous operation is **successful**;
  in this case, we say the promise is **resolved**.
- The **second** one is called when the asynchronous operation **failed**;
  in this case, we say the promise is **rejected**.

**Only one** of them is called, never both.

### Basic example

Let's illustrate this behavior with a simple example using an API to get random [jokes about Chuck Norris][chuck-jokes].

We'll use the [Fetch API][fetch], a alternative to the good ol' **XmlHttpRequest** object, to do this AJAX request.

```js
const request = fetch('https://api.chucknorris.io/jokes/random');
console.log(request); // Promise
```
> If you execute this code, you'll see that the `request` constant contains a `Promise` object, not the joke itself.

> Nonetheless, the request have been executed. You can be sure of that by displaying the **Network** tab of your browser's console

The **Fetch API** indeed uses Promises. That means we need to consume the returned `Promise` to get the actual result.

### Consuming a promise

As we've seen from the specification, you simply call a promise's `then(...)` method to be notified when it is resolved or rejected:

```js
function onResolved(joke) {
  console.log("Got a new Chuck Norris' joke!", joke);
}

function onRejected(reason) {
  console.log("Failed at getting a joke...", reason);
}

fetch('https://api.chucknorris.io/jokes/random')`.then(onResolved, onRejected)`;
```

- If a promise is **resolved**, the **first callback** will be called with the **resolved value**
- If a promise is **rejected**, the **second callback** will be called with the **rejection reason**

## Basic promise behavior

<!-- slide-front-matter class: center, middle -->

### Promise callback syntax

As we've seen in the previous examples,
you can declare your resolution and rejection callbacks separately and pass them to `.then()`:

But you can also declare the callbacks directly in the `.then()` call:

```js
fetch("https://api.chucknorris.io/jokes/random").then(
  `function (joke)` {
    console.log("Got a new Chuck Norris' joke!", joke);
  },
  `function (reason)` {
    console.log("Failed at getting a joke...", reason);
  }
);
```

For maximum laziness, you can also use arrow functions:

```js
fetch("https://api.chucknorris.io/jokes/random").then(
  (joke) => console.log("Got a new Chuck Norris' joke!", joke), // resolved
  (reason) => console.log("Failed at getting a joke...", reason) // rejected
);
```

Further examples will use these shorter versions for brevity.

### Promise callbacks are **optional**

You don't have to pass both resolution and rejection callbacks:

```js
const request = fetch("https://api.chucknorris.io/jokes/random")

// Only check if resolved.
request.then(console.log); // Response object

// Only check if rejected.
request.then(undefined, console.warn); // Not called.
```

#### Unhandled promise rejections

However, if you don't specify a **rejection callback** and the promise is rejected,
it will produce an **unhandled promise rejection warning**.
Depending on the JavaScript runtime, it may even kill the process:

```js
// Unknown hostname
const request = fetch(`"https://api.chucknorris"`)

// Only check if resolved.
request.then(console.log); // Not called, but UnhandledPromiseRejectionWarning.
```

It's good practice to always check for rejections.
However, you may safely **omit the resolution callback** if you don't need it:

```js
// Unknown hostname
const request = fetch("https://api.chucknorris")

// Only check if rejected.
request.then(undefined, (err) => console.warn(\`Oops: ${err}`));
// "Oops: TypeError: Failed to fetch"
```

### Using `catch()`

The `catch()` function is simply a shortcut to plug a **rejection callback** into a promise chain:

```js
request.then(onResolved)`.catch(onRejected)`;
```

It's **equivalent** to:

```js
request`.then`(onResolved, `onRejected`);
```

Or to:

```js
request.then(onResolved)`.then`(undefined, `onRejected`);
```

But it's easier to read and is similar in behavior to `try/catch`.

### Promise utilities

Quickly create a resolved promise with `Promise.resolve`:

```js
const resolvedPromise = `Promise.resolve`('foo');

resolvedPromise.then(function onResolved(value) {
* console.log(value); // "foo"
}, function onRejected(err) {
  console.warn(\`Oops: ${err.message}`); // not called
});
```

Quickly create a rejected promise with `Promise.reject`:

```js
const rejectedPromise = `Promise.reject`(new Error('bug'));

rejectedPromise.then(function onResolved(value) {
  console.log(value); // not called
}, function onRejected(err) {
* console.warn(\`Oops: ${err.message}`); // "Oops: bug"
});
```


### Chaining `.then()` calls

On of the advantages of Promises over basic callbacks is the ability **to chain operations**, creating a clear sequence of decoupled operations.

The `then(...)` method returns a new `Promise`.

If your return a **value** from the callback argument, this returned `Promise` will be **resolved with this value**.

```js
const request = fetch("https://api.chucknorris.io/jokes/random");

request
  .then(function () {
*   return "Random value";
  })
  .then(console.log); `// Random value`
```

### Chaining promises

If you return **another Promise** from the callback argument, the next `then(...)` in the chain will apply to this returned Promise.

```js
const request = fetch("https://api.chucknorris.io/jokes/random");

request
  .then(
    function onResolved(chuckJoke) {
*     return fetch("https://icanhazdadjoke.com/");
    },
    function onRejected() {
      console.warn("Chuck Norris Joke Not Received"); // Not called
    }
  )
  .then(
    function onResolved(dadJoke) {
      console.log("Dad Joke Received", dadJoke);
      // `Dad Joke Received: Response { ... }`
    },
    function onRejected() {
      console.warn("Dad Joke Not Received"); // Not called
    }
  );
```

#### Practical example

The `Promise` returned by a `fetch(...)` call contains, if resolved, a `Response` object, not the `Joke` object itself.

We need to get the content of the `Response` in order to display our joke. Let's use promise chaining to do so:

```js
fetch("https://api.chucknorris.io/jokes/random")
  // First promise: Response to API call
* .then(response => response.json())
  // Second promise: Received Joke object
* .then(joke => console.log(\`Heard a new joke today!\nIt goes: "${joke.value}"`))
  // Prints:
  // Heard a new joke today!
  // It goes: "Chuck Norris went out of an infinite loop."
```
> The `json()` method of a `Response` object parses the body content as a JSON string and returns a corresponding JS object

## Dive deeper

Promises are **a powerful tool** to work with asynchronous code.

It is **not limited to HTTP requests** and can be used for many use cases such as file operation, lengthy operations, etc.

Chaining promises is very useful to create clear operation sequence and handle error in the chain.

If you want to **dive deeper** in the subject of Promises, [here's a more in-depth subject][js-prom] that covers many more advanced concepts.

[chuck-jokes]: https://api.chucknorris.io/
[fetch]: https://developer.mozilla.org/fr/docs/Web/API/Fetch_API/Using_Fetch
[js-bas]: ../js
[js-prom]: https://mediacomem.github.io/comem-devmobil/latest/subjects/js-promises/?home=https%3A%2F%2Fmediacomem.github.io%2Fcomem-masrad-dfa%2Flatest
