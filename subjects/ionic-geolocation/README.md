# Geolocation in Ionic

Learn how to locate and track your users position in an Ionic application.

**You will need**

- A running [Ionic][ionic] application

**Recommended reading**

- [Ionic](../ionic/)
- [Angular](https://mediacomem.github.io/comem-masrad-dfa/latest/subjects/angular?home=https%3A%2F%2Fmediacomem.github.io%2Fcomem-devmobil%2Flatest)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Geolocation](#geolocation)
  - [Registering the Geolocation service with Angular](#registering-the-geolocation-service-with-angular)
  - [Injecting the Geolocation service](#injecting-the-geolocation-service)
  - [Getting the user's location](#getting-the-users-location)
  - [Tracking the user's location](#tracking-the-users-location)
  - [Allowing the brower to retrieve the user's location](#allowing-the-brower-to-retrieve-the-users-location)
  - [Geolocation on insecure origins](#geolocation-on-insecure-origins)
- [Leaflet](#leaflet)
  - [Importing Leaflet styles](#importing-leaflet-styles)
  - [Importing Leaflet assets](#importing-leaflet-assets)
  - [Registering the Leaflet module with Angular](#registering-the-leaflet-module-with-angular)
  - [Displaying a map](#displaying-a-map)
    - [Adding the map to the component's template](#adding-the-map-to-the-components-template)
    - [Troubleshooting](#troubleshooting)
  - [Markers](#markers)
    - [Define](#define)
    - [Adding the markers to the map](#adding-the-markers-to-the-map)
    - [Adding a tooltip to a marker](#adding-a-tooltip-to-a-marker)
  - [Getting a reference to the map](#getting-a-reference-to-the-map)
  - [Listening to map events](#listening-to-map-events)
- [Using your mobile device's camera](#using-your-mobile-devices-camera)
  - [Injecting the camera service](#injecting-the-camera-service)
  - [Taking a picture](#taking-a-picture)
  - [Displaying the picture in the template](#displaying-the-picture-in-the-template)
- [Resources](#resources)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Geolocation

The [HTML Geolocation API][html-geolocation] allows the user to provide their geographical location to web applications.
Since an Ionic app is a web app, you can use it directly.

However, you can also use the [Ionic native geolocation][ionic-native-geolocation] plugin (and the related Cordova plugin).
The Cordova plugin provides a JavaScript API to use native geolocation capabilities when the HTML Geolocation API is not available ; the Ionic Native plugin wraps this JavaScript API in an Angular Service for usage in an Ionic/Angular app.

Install the plugins by following [the documentation][ionic-native-geolocation] adapted for wether you're using Cordova or Capacitor in your app.

### Registering the Geolocation service with Angular

The `@ionic-native/geolocation` plugin provides an **Angular service** named `Geolocation` that you can use to locate the user.
To be able to **inject** it in your application's components or services, you must add that service to your module's **providers**.

For example, you may add it to `AppModule` in `src/app/app.module.ts` in a standard starter project:

> **Be extra sure to check that the import path ends with `/ngx`**, since we are using Angular in our case.
>
> See https://ionicframework.com/docs/native/overview#angular

```ts
// Other imports...
*import { Geolocation } from '@ionic-native/geolocation/ngx';

@NgModule({
  // ...
  providers: [
    // Other providers...
*   Geolocation
  ]
})
export class AppModule {}
```

### Injecting the Geolocation service

Now that the `Geolocation` service is registered, you can inject it in one of your components or services.

Here's an example of how you would inject it in a sample `ExamplePage` component:

```ts
// Other imports...
*import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'page-example',
  templateUrl: 'example.html',
})
export class ExamplePage {
  // ...
  constructor(
    // Other injections...
*   private geolocation: Geolocation
  ) {}
  // ...
}
```

### Getting the user's location

Once that's done, obtaining the user's current geographic coordinates once is as simple as calling the service's `getCurrentPosition()` method:

```ts
// ...
import { Geoposition } from '@ionic-native/geolocation/ngx';

export class ExamplePage implements OnInit {
  // ...
  ngOnInit() {
    // ...
    // Geoposition is an interface that describes the position object
*   this.geolocation.getCurrentPosition().then((position: Geoposition) => {
*     const coords = position.coords;
*     console.log(\`User is at ${coords.longitude}, ${coords.latitude}`);
*   }).catch(err => {
*     console.warn(\`Could not retrieve user position because: ${err.message}`);
*   });
  }
  // ...
}
```

The `getCurrentPosition()` method is an **asynchronous** operation which returns a promise, so you have to call `.then()` to be notified when the location is available.
You should also call `.catch()` to be notified if there's a problem retrieving the location.

### Tracking the user's location

If you want to periodically be notified of the user's current geographic location, you should the `watchPosition()` method of the `Geolocation` service.

Note that this method returns an **observable** instead of a **promise**. Hence you needing to `subscribe()` to it to get notified of the change:

```ts
// ...

export class ExamplePage implements OnInit {
  // ...
  ngOnInit() {
    // ...

*   const trackingSubscription = this.geolocation.watchPosition().subscribe({
*     next: (position: Geoposition) => {
*       const coords = position.coords;
*       console.log(\`User is at ${coords.longitude}, ${coords.latitude}`);
*     },
*     error: err => {
*       console.warn(`Could not retrieve user position because: ${err.message}`);
*     }
*   });
  }
  // ...
}
```

### Allowing the brower to retrieve the user's location

When developing locally with `ionic serve`, the browser will ask for permission to get the user's location.
Click **Allow**:

<p class='center'><img src='images/browser-allow-geolocation.png' class='w50' /></p>

### Geolocation on insecure origins

If you get the following warning:

```txt
*getCurrentPosition() and watchPosition() no longer work on insecure origins.
*To use this feature, you should consider switching your application to a
*secure origin, such as HTTPS. See https://goo.gl/rStTGz for more details.
```

It's because your Ionic app is not running on localhost but on your IP address
(e.g. you are on `http://192.168.1.100:8100` in your browser's address bar),
and getting the user's location over unencrypted HTTP is **no longer allowed on insecure origins**.

You should run your Ionic app on localhost to solve this issue:

```bash
$> ionic serve --address localhost
```

## Resources

**Documentation**

- [Ionic documentation][ionic-docs]
- [Ionic native geolocation plugin][ionic-native-geolocation] & [Cordova geolocation plugin][cordova-geolocation]

[cordova]: https://cordova.apache.org
[cordova-camera]: https://github.com/apache/cordova-plugin-camera
[cordova-geolocation]: https://github.com/apache/cordova-plugin-geolocation
[definitely-typed]: http://definitelytyped.org
[ionic]: http://ionicframework.com
[ionic-docs]: https://ionicframework.com/docs/
[ionic-native-camera]: https://ionicframework.com/docs/native/camera/
[ionic-native-geolocation]: https://ionicframework.com/docs/native/geolocation/
[html-geolocation]: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation
[leaflet]: http://leafletjs.com
[leaflet-map]: http://leafletjs.com/reference-1.3.0.html#map-example
[leaflet-map-events]: http://leafletjs.com/reference-1.3.0.html#map-event
[leaflet-marker]: http://leafletjs.com/reference-1.3.0.html#marker
[leaflet-tooltip]: http://leafletjs.com/reference-1.3.0.html#tooltip
[ngx-leaflet]: https://github.com/Asymmetrik/ngx-leaflet#readme