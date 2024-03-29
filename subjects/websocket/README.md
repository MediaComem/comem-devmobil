# WebSocket

Learn how to connect and react to events from a WebSocket in your Angular application.

<!-- slide-include ../../BANNER.md -->

**Recommended reading**

- [WebSocket (archioweb)](https://mediacomem.github.io/comem-archioweb/2022-2023/subjects/ws/?home=MediaComem%2Fcomem-archioweb%23readme#1)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [WebSocket API](#websocket-api)
- [`WebSocket`](#websocket)
  - [Angular WebSocket Service](#angular-websocket-service)
  - [Use the service](#use-the-service)
- [Listening to messages](#listening-to-messages)
  - [Add listening capabilities to the Angular Service](#add-listening-capabilities-to-the-angular-service)
    - [`listen()` method](#listen-method)
    - [Listen on the component](#listen-on-the-component)
    - [Type the message data](#type-the-message-data)
  - [Send messages](#send-messages)
    - [Sending messages on the service](#sending-messages-on-the-service)
    - [Sending messages from the component](#sending-messages-from-the-component)
- [Next steps](#next-steps)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## WebSocket API

Using WebSocket on the front-end is supported by [most - if not all - browsers][caniuse-ws] since before 2011, thanks to a native HTML5 API.

> Since there is a native WebSocket API, you technically don't need to install any `npm` packages to use it in your app. Those packages simply provides more high level implementations.

In this subject, we will build a very minimal Angular Service to connect, listen and send messages to a backend offering WebSocket capabilities, based on the [documentation for the WebSocket API][mdn-ws].

## `WebSocket`

The `WebSocket` class is the main interface to the WebSocket API.

To connect to an existing WebSocket server, you simply need to instantiate a new `WebSocket` object, providing the constructor with the WebSocket URL:

```js
const ws = `new WebSocket('ws://echo.websocket.org')`;
```

A `WebSocket` object can be in one of four states, defined as static constants of the `WebSocket` class:

- `CONNECTING` - The connection is not yet opened
- `OPEN` - The connection is opened and messages can be exchanged
- `CLOSING` - The connection is being closed
- `CLOSED` - The connection is closed and messages can no longer be exchanged

To check the state in which a `WebSocket` instance currently is, use its `readyState` property:

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
import { Observable, Observer, ReplaySubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

const WS_SERVER_URL = 'ws://echo.websocket.org';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  // A ReplaySubject will emit its X latest values (1 in this case) each time
  // its 'subscribe()' method is called
* private ws$ = new ReplaySubject<WebSocket>(1);

  constructor() {
    const socket = new WebSocket(WS_SERVER_URL);
    socket.onopen = () => {
      console.log('Successfully connected to the WebSocket at', WS_SERVER_URL);
      // When the connection is done, emit the WebSocket instance
*     this.ws$.next(socket);
    };
  }
}
```

### Use the service

To use the service, simply inject it in one of your components:

```ts
// Other imports...
*import { WebsocketService } from 'path/to/websocket.service';

@Component({ /* ... */ })
export class ExampleComponent {

  // ...

  constructor(`private wsService: WebsocketService`) {
    // ...
  }

  // ...
}
```

> Injecting the service is enough to connect to the WebSocket, since we do this in the Service constructor.

## Listening to messages

Several of a `WebSocket` object's properties can be set to react to specific events such as:

- The connection is opened ([`onopen`][onopen])
- A message is received ([`onmessage`][onmessage])
- An error occured ([`onerror`][onerror])
- The connection is closed ([`onclose`][onclose])

Each of these porperties expect a callback function that will be called when the corresponding event occurs:

> We already did this in the Angular Service to react to a successfull connection

```js
// Log all messages
ws.onmessage = `message => console.log(message)`;
```

### Add listening capabilities to the Angular Service

As said in previous subjects, Angular 2+ heavily uses `rxjs`' `Observable`, which are very well suited to handle WebSocket messages.

Remember that `Observable` allow us to **subscribe** to a particular **stream of events** in order to do something each time on of those events is fired, until the **stream is closed**.

From the the front-end point of view, a WebSocket connection is pretty much the same thing: a **stream of messages** emitted until the **connection is closed**.

It would thus be quite natural that our Angular `WebSocketService` exposes an `Observable` that emits a new value each time a message is broadcasted on the WebSocket connection.

> The WebSocket API define such a message with the `MessageEvent` interface.

Let's create a new `listen()` method on our `WebSocketService` that returns an `Observable<any>` (where any is the data of the message).

#### `listen()` method

Add this method to the service in `websocket.service.ts`:

```ts
import { Injectable } from '@angular/core';
*import { Observable, Observer, ReplaySubject } from 'rxjs';
*import { map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  // ...
  public listen<T = any>(): Observable<T> {
    // Only listen when the connection is opened
    return this.ws$.pipe(
      // Make an observable out of the websocket stream
      switchMap(socket =>
        new Observable((subscriber: Observer<MessageEvent<T>>) => {
          // When a new message is received, the Observable will emit this message
*         socket.onmessage = message => subscriber.next(message);
          // When a websocket error occurs, the Observable will emit a new error
*         socket.onerror = error => subscriber.error(error);
          // When the websocket closes, the observable completes
*         socket.onclose = () => subscriber.complete();
          // Function that will be called if the user manually unsubscribe
*         return () => socket.close();
        })
      ),
      // When a message is emitted, change the value to the message content
*     map((event: MessageEvent<T>) => event.data)
    );
  }
}
```

#### Listen on the component

To listen to messages on the `WebSocket` instance in your component, subscribe to its `listen()` method:

```ts
// Imports...

@Component({ /* ... */ })
export class ExampleComponent {

  // ...

  constructor(private wsService: WebsocketService) {
    // ...
    this.wsService
*     .listen()
*     .subscribe(message => {
*       // Do something when a message is received
*     });
    // ...
  }

  // ...
}
```

#### Type the message data

By default, the data that you can access in the `listen()` subscribe callback is type with `any`, since the method does not know the structure of the received message data. You can tell what type of data you expect to receive to the `listen()` to have proper typings.

Let's suppose we designed our WebSocket API so that all our messages have a `type` and `content` property. We could define it in our app:

```ts
export type WsMessage = {
  type: string;
  content: any;
};
```
Now, when calling the `listen()` method, we can tell it that we expect to receive this type of data in our messages:

```ts
this.wsService.listen`<WsMessage>`().subscribe(message => {
  // message is now of type WsMessage.
});
```

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

To make our `WebSocketService` capable of sending messages, we will create a new `send()` method that takes an argument, and calls the `WebSocket.send()` method.

```ts
// Imports

const WS_SERVER_URL = 'ws://echo.websocket.org';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private ws: WebSocket;

  // ...

  public `send(data: unknown): void` {
    this.ws$.subscribe(socket => {
*     socket.send(JSON.stringify(data));
    });
  }
}
```
> Note that the `data` param is typed as `unknown`, because the `send()` method doesn't care (nor know) what type of data you want to send.

#### Sending messages from the component

To send some message from the component, simply call our `WebSocketService`'s `send()` method with a serializable value, e.g. a binded input value:

```html
<input type="text" name="msg" id="msg" `[(ngModel)]="message" ` />
<button `(click)="sendMessage()" `>Envoyer</button>
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

- Sending binary data with our service's `send()` method,
- Keeping and retrieving several websocket connections in the service,
- ...

> The complete Angular `WebSocketService` can be found [here][ng-ws]

[caniuse-ws]: https://caniuse.com/#feat=mdn-api_websocket
[mdn-ws]: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
[readystate]: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
[onclose]: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/onclose
[onerror]: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/onerror
[onmessage]: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/onmessage
[onopen]: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/onopen
[send]: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
[ng-ws]: https://gist.github.com/Tazaf/d2530cfafc287e53ef20ea3dc1057617
