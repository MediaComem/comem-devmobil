# WAMP

Learn how to connect to a WAMP Brocker, and send/receive events on topics or call/register RPCs in your Angular application.

<!-- slide-include ../../BANNER.md -->

**Recommended reading**

* [WAMP (archioweb)](https://mediacomem.github.io/comem-archioweb/2019-2020/subjects/wamp/?home=MediaComem%2Fcomem-archioweb%23readme#1)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [WAMP](#wamp)
  - [Angular WAMP Service](#angular-wamp-service)
  - [Use the service](#use-the-service)
- [Listening to topics](#listening-to-topics)
  - [Listen on the component](#listen-on-the-component)
- [Send events in topic](#send-events-in-topic)
  - [Sending events from the component](#sending-events-from-the-component)
- [RPC](#rpc)
  - [Calling a registered procedure](#calling-a-registered-procedure)
  - [Call a registered procedure from the component](#call-a-registered-procedure-from-the-component)
  - [Registering a procedure](#registering-a-procedure)
  - [Register a component's method as a Remote Procedure](#register-a-components-method-as-a-remote-procedure)
- [Next steps](#next-steps)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## WAMP

Since WAMP is a standard that is not (yet) included in the JavaScript language, there is no native HTML5 API out of the box in our browser.

To use this technology, we will have to install a new package, namely the `autobahn-browser` package, which is a browser-oriented build of the [autobahn][autobahn] library:

In your project, execute the following commands to install the package:

```bash
$> npm install autobahn-browser
```
> Sadly, there is no [typing][autobahn-types] available for this library. There is typing for the [`autobahn`][autobahn-npm] library, but this lib does not work well on browsers...

### Angular WAMP Service

As we did in the [WebSocket][ws-subject], we will also create a minimal Angular Service to interact with the WAMP server.

Create a new file, e.g. `wamp.service.ts` with the following code:

```ts
import { Injectable } from '@angular/core';
import { Connection, Session } from 'autobahn-browser';
import { ReplaySubject } from 'rxjs';

*const wampUrl = '<YOUR_WAMP_BROCKER_URL>';
*const wampRealm = '<YOUR_WAMP_REALM>';

@Injectable({ providedIn: 'root' })
export class WampService {
  // Keep a reference to the WAMP session once connected
  private session$ = new ReplaySubject<Session>(1);

  constructor() {
    // Create the connection to the WAMP Brocker
    const connection = new Connection({ url: wampUrl, realm: wampRealm });
    // When the connection is open, emit the session through the ReplaySubject
    connection.onopen = session => this.session$.next(session);
    // Initiate the connection
    connection.open();
  }
}
```

### Use the service

To use the service, simply inject it in one of your components:

```ts
// Other imports...
*import { WampService } from 'path/to/wamp.service';

@Component({ /* ... */ })
export class ExampleComponent {

  // ...

  constructor(`private wamp: WampService`) {
    // ...
  }

  // ...
}
```
> Injecting the service is enough to connect to the WAMP Brocker, since we do this in the Service constructor.

## Listening to topics

With WAMP you need to explicitly subscribe to specific topics in order to be notified of incoming events.

Let's add this to our newly created service:

```ts
// Previous imports
import { `Observable, Observer,` ReplaySubject } from 'rxjs';
*import { switchMap } from 'rxjs/operators';

// ...

@Injectable({ providedIn: 'root' })
export class WampService {
  // ...

* public listen(topicUri: string): Observable<any> {
*   return this.session$.pipe(
*     switchMap(session => {
*       return new Observable((subscriber: Observer<any>) => {
*         // Subscribe to the topic and make the observable emit a value
*         // each time a new event is published to this topic
*         session.subscribe(topicUri, event => subscriber.next(event));
*       });
*     })
*   );
  }
}
```
### Listen on the component

To listen to events on a certain topic in your component, subscribe to the `listen()` method of your `WampService` instance, providing it the URI of said topic:

```ts
// Imports...

@Component({ /* ... */ })
export class ExampleComponent {

  // ...

  constructor(private wampt: WampService) {
    // ...
    this.wamp
*     .listen('<YOUR_TOPIC_URI>')
*     .subscribe(event => {
*       // Do something when a event is received
*     });
    // ...
  }

  // ...
}
```

## Send events in topic

Sending an event is quite easy, once connected to the WAMP Brocker. Let's add a new method in our service to do so:

```ts
// Imports

@Injectable({ providedIn: 'root' })
export class WampService {
  private session$ = new ReplaySubject<Session>(1);

  // ...

  public `send(topic: string, arr: any[], obj: object)`: void {
    // Subscribe to retrieve the active WAMP session
    this.session$.subscribe(session => {
      // Publish the given message on the given topic
*     session.publish(topic, [message]);
    });
  }
}
```
When publishing events on a topic, you must first pass the topic's URI, then you can either pass an array (`arr` param), an object (`obj` param), or both, depending on your use case. The only requirements is that both `arr` and `obj` are JSON serializable.

### Sending events from the component

To send some events from the component, simply call the `WampService`'s `send()` method with the topic URI and the values:

```html
<input type="text" name="wamp-msg" id="wamp-msg" `[(ngModel)]="eventContent"`>
<button `(click)="sendEvent()"`>Send WAMP Event</button>
```

```ts
// Imports...

@Component({ /* ... */ })
export class ExampleComponent {
* eventContent: string;

  // ...

* sendEvent() {
*   this.wamp.send('<YOUR_TOPIC_URI>', [this.eventContent]);
* }

  // ...
}
```
## RPC

In addition to event exchange in topics, WAMP also defines a way to make Remote Procedure Calls through the underlying WebSocket connection.

To do so, some clients **register** procedures on the WAMP Brocker so that other clients can call them.

We will add those two features to our Angular `WampService`.

### Calling a registered procedure

Let's add a new method to the service:

```ts
// ...
@Injectable({ providedIn: 'root' })
export class WampService {
  // ...
  public `call(procUri: string, arr?: any[], obj?: object, options?: object)`: Observable<any> {
    // Retrieve the WAMP session
    return this.session$.pipe(
      switchMap(session => {
        // Convert the RPC promise to an Observable equivalent
        return new Observable((subscriber: Observer<any>) => {
*         session
            // Make the call
*           .call(procUri, arr, obj, options)
            // If the call succeeds, emit the returned value
*           .then(subscriber.next.bind(subscriber))
            // If the call fails, emit the error
*           .catch(subscriber.error.bind(subscriber))
            // Whatever happens, unsubscribe from the Observable at the end
*           .finally(subscriber.complete.bind(subscriber));
        });
      })
    );
  }
}
```
### Call a registered procedure from the component

Simply call our `WampService`'s `call()` method, providing it the Remote Procedure URI _(and any necessary params or options)_.

For example, we could add a button that, once clicked, will call the RPC through the WAMP Brocker:

```html
<!-- Somewhere in your template -->
<button (click)="makeRPC()">Remote Procedure Call</button>
```
And in the component:

```ts
// Imports...

@Component({ /* ... */ })
export class ExampleComponent {
  // ...
  constructor(private wamp: WampService) { /* ... */ }
  // ...
* makeRPC() {
    // Call the remote procedure and log the results
*   this.wamp.call('<YOUR_REMOTE_PROCEDURE_URI>').subscribe(console.log);
* }
}
```

### Registering a procedure

Finally, let's see how we could register a procedure on the WAMP Brocker so that other connected clients could call it.

Let's yet another method to our `WampService`:

```ts
// ...
@Injectable({ providedIn: 'root' })
export class WampService {
  // ...
* public register(
*   procName: string,
*   proc: (arr: any[], obj?: object, options?: object) => any
* ): Observable<any> {
*   return this.session$.pipe(
*     switchMap(session => {
*       return new Observable((subscriber: Observer<any>) => {
*         session
*           .register(procName, proc)
*           .then(subscriber.next.bind(subscriber))
*           .catch(subscriber.error.bind(subscriber))
*           .finally(subscriber.complete.bind(subscriber));
*       });
*     })
*   );
* }
}
```
### Register a component's method as a Remote Procedure

Now, on a component that injects the `WampService`, you can register any of the component's method as a Remote Procedure:

```ts
// Imports...

@Component({ /* ... */ })
export class ExampleComponent {
  // ...
  constructor(private wamp: WampService) {
    // ...
*   this.wamp
      // Register the 'this.remoteProc' method under a user-defined URI
*     .register('com.angular.now', this.remoteProc)
*     .subscribe();
  }
  // ...
* remoteProc(arr: any[], obj: object, options: object) {
*   console.log('Someone is calling com.myapp.date with this args', arr, obj, options);
*   const now = new Date();
*   return now.toISOString();
* }
}
```

## Next steps

> The complete Angular `WampService` can be found [here][ng-wamp]

[autobahn]: https://crossbar.io/autobahn/
[autobahn-types]: https://www.npmjs.com/package/@types/autobahn
[autobahn-npm]: https://www.npmjs.com/package/autobahn
[ws-subject]: ../websocket/readme.md
[ng-wamp]: https://gist.github.com/Tazaf/c5be09cc52ad037ce73c246bf5da241a
