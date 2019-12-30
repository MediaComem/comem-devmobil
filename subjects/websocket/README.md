# WebSocket

Learn how to connect and react to events from a WebSocket in your Angular application.

<!-- slide-include ../../BANNER.md -->

**Recommended reading**

* [WebSocket (archioweb)](https://mediacomem.github.io/comem-archioweb/2019-2020/subjects/ws/?home=MediaComem%2Fcomem-archioweb%23readme#1)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Types](#types)
  - [Basic types](#basic-types)
  - [Type checking](#type-checking)
  - [Function parameter & return types](#function-parameter--return-types)
  - [Function types](#function-types)
  - [Type inference](#type-inference)
  - [Any](#any)
  - [Union types](#union-types)
  - [Enums](#enums)
  - [Void](#void)
  - [Type aliases](#type-aliases)
- [Functions](#functions)
  - [Mandatory parameters](#mandatory-parameters)
  - [Optional parameters](#optional-parameters)
- [Classes](#classes)
  - [Class types](#class-types)
  - [Accessibility modifiers](#accessibility-modifiers)
  - [Abstract classes](#abstract-classes)
- [Interfaces](#interfaces)
  - [Defining an interface](#defining-an-interface)
  - [Optional properties](#optional-properties)
  - [Interface functions](#interface-functions)
  - [Extending interfaces](#extending-interfaces)
- [Generics](#generics)
  - [Generic functions](#generic-functions)
  - [Generic type syntax](#generic-type-syntax)
  - [Generic type argument inference](#generic-type-argument-inference)
  - [Generic classes & interfaces](#generic-classes--interfaces)
  - [Generic constraints](#generic-constraints)
- [Decorators](#decorators)
  - [What is a decorator?](#what-is-a-decorator)
  - [Decorator factory](#decorator-factory)
  - [Class decorator example](#class-decorator-example)
  - [Method decorator example](#method-decorator-example)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## WebSocket API

Using WebSocket on the front-end is achievable through the use of the native HTML5 WebSocket API, which is supported by [most - if not all - browsers][caniuse-ws] since before 2011.

> Since it's a native API, you won't need to `npm install` any new packages, event though some exists, to leverage WebSocket in your Angular application.

In this subject, we will use the [documentation for the WebSocket API][mdn-ws] to build a very minimal Angular Service to connect, listen and send messages to a backend offering WebSocket capabilities.

## `WebSocket`

The `WebSocket` class is the main interface to the WebSocket API.

To connect to an existing WebSocket server, you simply need to instantiate a new `WebSocket` object, providing the constructor with the websocket URL:

```js
const ws = `new WebSocket('ws://echo.websocket.org')`;
```
A `WebSocket` object can be in one of four states, all available as static constats of the `WebSocket` class:
* `CONNECTING` - The connection is not yet opened
* `OPEN` - The connection is opened and messages can be sent/listen to
* `CLOSING` - The connection is being closed
* `CLOSED` - The connection is closed and messages can no more be sent/listen to

A `WebSocket` instance have a `readyState` property that reflects its current state:

```js
if (`ws.readyState` === `WebSocket.OPEN`) {
  // Do something only if the connection is open
}
```

### Angular WebSocket Service

We can create a new Angular service that will manage this `WebSocket` object and proxy it to the components in which it is injected.

Create a new file, e.g. `websocket.service.ts` with the following code:

```ts
import { Injectable } from '@angular/core';

const WS_SERVER_URL = 'ws://echo.websocket.org';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  // Keep an internal reference to the WebSocket object
* private ws: WebSocket;

  public connect(): WebsocketService {
    // Create the WebSocket object if it does not exists
    if (!this.ws) {
*     this.ws = new WebSocket(WS_SERVER_URL);
      console.log('Successfully connected: ' + WS_SERVER_URL);
    }
    // Return the service so that we can chain our calls to its methods
    return this;
  }
}
```

### Use the service

To use the service, simply inject it on one of your components, and call the `connect()` method in the component's `constructor` or `ngOnInit` method:

```ts
// Other imports...
*import { WebsocketService } from 'path/to/websocket.service';

@Component({ /* ... */ })
export class ExampleComponent {

  // ...

  constructor(`private wsService: WebsocketService`) {
    // ...
*   this.wsService.connect();
    // ...
  }

  // ...
}
```

## Listening to messages

Several of a `WebSocket` object's properties can be set to react to specific events such as:
* The connection is opened ([`onopen`][onopen])
* A message is received ([`onmessage`][onmessage])
* An error occured ([`onerror`][onerror])
* The connection is closed ([`onclose`][onclose])

Each of these porperties expect a callback function that will be called when the corresponding event occurs:

```js
// Log all messages
ws.onmessage = `message => console.log(message)`;
```

### Add listening capabilities to the Angular Service

As said in previous subjects, Angular 2+ heavily uses `rxjs`' `Observable`, which are very well suited to handle WebSocket messages.

Remember that `Observable` allow us to **subscribe** to a particular **stream of events** in order to do something each time this event is fired, until the **stream is closed**.

From the point of view of the front-end, a WebSocket connection is pretty much the same thing: a **stream of messages** emitted until the **connection is closed**.

It would thus be quite natural that our Angular `WebSocketService` exposes an `Observable` that emits a new value each time a message is broadcasted on the WebSocket connection. The WebSocket API define such a message with the `MessageEvent` interface.

Let's create a new `listen()` method on our `WebSocketService` that returns an `Observable<MessageEvent>`.

#### `listen()` method

Add this method to the service in `websocket.service.ts`:

```ts
// Previous imports...
*import { Observable, Observer } from 'rxjs';
*import { map } from 'rxjs/operators';

const WS_SERVER_URL = 'ws://localhost:3000/';

@Injectable()
export class WebsocketService {
  // ...

  public listen(): Observable<MessageEvent> {
    return new Observable((subscriber: Observer<MessageEvent>) => {
      // When a new message is received, the Observable will emit this message
*     this.ws.onmessage = message => subscriber.next(message);
      // When a websocket error occurs, the Observable will emit a new error
*     this.ws.onerror = error => subscriber.error(error);
      // When the websocket closes, the observable completes
*     this.ws.onclose = () => subscriber.complete();
      // Return a function that will be called if the user manually unsubscribe
*     return () => this.ws.close();
    }).pipe(
      // When a message is emitted, change the value to the actual message content
*     map((event: MessageEvent) => event.data)
    );
  }
}
```
#### Listen on the component

To listen to messages on the WebSocket instance in your component, subscribe to the `listen()` method:

```ts
// Imports...

@Component({ /* ... */ })
export class ExampleComponent {

  // ...

  constructor(private wsService: WebsocketService) {
    // ...
    this.wsService
      .connect()
*     .listen()
*     .subscribe(message => {
*       // Do something when a message is received
*     });
    // ...
  }

  // ...
}
```
> Be sure to call the `connect()` method first, before calling `listen()`. You can't listen on a websocket you're not connected to...

### Send messages

Sending a message is very easy, once connected to a WebSocket.

Simply call the [`send()` method][send] of a `WebSocket` instance, passing it the data you want to send (usually some `JSON` formatted value):

```js
const data = {
  foo: 'bar'
};
*ws.send(JSON.stringify(data));
```
> Note that you could also send binary data (e.g. files) through this method.

#### Sending messages on the service

To make our WebSocketService capable of sending messages, we will create a new `send()` method that takes an argument, and call itself the `WebSocket.send()` method.

We'll just add a tiny bit of security by only sending the data if the websocket is currently opened:

```ts
// Imports

const WS_SERVER_URL = 'ws://echo.websocket.org';

@Injectable()
export class WebsocketService {
  private ws: WebSocket;

  // ...

  public `send(data: object): void` {
    if (this.ws && `this.ws.readyState === this.ws.OPEN`) {
*     this.ws.send(JSON.stringify(data));
    }
  }
}
```
#### Sending messages from the component

To send some message from the component, simply call our `WebSocketService`'s `send()` method with a serializable value, e.g. a binded input value:

```html
<input type="text" name="msg" id="msg" `[(ngModel)]="message"`>
<button `(click)="sendMessage()"`>Envoyer</button>
```

```ts
// Imports...

@Component({ /* ... */ })
export class ExampleComponent {
* message: string;

  // ...

* sendMessage() {
*   this.wsService.send({ msg: this.message });
* }

  // ...
}
```
## Next steps

As annouced, we've built a very simple Angular Service to manage websocket connection, and sending/receiving messages.

Some enhancment could be implemented, depending on your needs, such as:

* Sending binary data with our service's `send()` method,
* Keeping and retrieving several websocket connections in the service,
* ...

[caniuse-ws]: https://caniuse.com/#feat=mdn-api_websocket
[mdn-ws]: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
[readystate]: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
[onclose]: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/onclose
[onerror]: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/onerror
[onmessage]: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/onmessage
[onopen]: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/onopen
[send]: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
