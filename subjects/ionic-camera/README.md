# Using your mobile device's camera

The camera is part of your mobile device's hardware,
so you'll need Cordova/Capacitor to access it for you.

Follow the appropriate installation instruction of the [Ionic native camera plugin][ionic-native-camera] to setup those plugins in your project.

The Ionic native camera plugin has a `Camera` service which you need to add to your `AppModule`'s `providers` array,
typically in `src/app/app.module.ts` in a starter project:

```ts
// Other imports...
*import { Camera } from '@ionic-native/camera/ngx';

@NgModule({
  // ...
  providers: [
    // Other providers...
*   Camera
  ]
})
export class AppModule {}
```

## Injecting the camera service

Now that you have registered the `Camera` service,
you can inject it into one of your components.

Here's how you would do it in a sample `ExamplePage` component:

```ts
// Other imports...
*import { Camera } from '@ionic-native/camera/ngx';

// ...
export class ExamplePage {
  // ...
  constructor(
    // Other constructor parameters...
*   private camera: Camera
  ) {
    // ...
  }
  // ...
}
```

### Taking a picture

Time to use that `Camera` service to take a picture.
Add this `takePicture()` method to the component,
along with the `pictureData` field to store the data:

```ts
// Other imports...
import { Camera, `CameraOptions` } from '@ionic-native/camera/ngx';

// ...
export class ExamplePage {
* pictureData: string;
  // ...
* takePicture() {
*   const options: CameraOptions = {
*     quality: 100,
*     destinationType: this.camera.DestinationType.DATA_URL,
*     encodingType: this.camera.EncodingType.JPEG,
*     mediaType: this.camera.MediaType.PICTURE
*   };
*
*   this.camera.getPicture(options).then(pictureData => {
*     this.pictureData = pictureData;
*   }).catch(err => {
*     console.warn(\`Could not take picture because: ${err.message}`);
*   });
* }

}
```

### Displaying the picture in the template

Add a `<button>` tag in the component's template to call our `takePicture()` method,
and an `<img>` tag to display the picture once it's taken:

```html
<ion-content padding>
  <!-- ... -->
  * <button ion-button (click)="takePicture()">Take picture</button> *
  <img *ngIf="pictureData" src="data:image/jpeg;base64,{{ pictureData }}" />
</ion-content>
```

It should work **on your device** now!

(Of course, it will not work in the browser when developing on your computer because it requires the mobile device's actual camera.)

Note that because we called `Camera.getPicture()` with a `destinationType` set to `DestinationType.DATA_URL`,
the `pictureData` variable we get back contains the picture's base64-encoded raw data,
but you can also save it to a file or customize other camera parameters.
Read the documentation of the [Ionic native camera plugin][ionic-native-camera] for more information.

## Resources

**Documentation**

- [Ionic documentation][ionic-docs]
- [Ionic native camera plugin][ionic-native-camera] & [Cordova camera plugin][cordova-camera]

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