# Image Upload

You can use any image upload service you like.
The [qimg API][qimg] is a limited service provided for this course.



## Limitations

* Images cannot be larger than 2MB
* Each user has a quota: a maximum number of images they can upload

  The quota is 10 by default.
  When you start uploading more than 10 images, older images will be deleted.



## Configuration

You should have received a qimg authentication token that grants you access to the qimg API.

There are two new configuration properties your app needs to have:

* The URL to the qimg API.
* The qimg API authentication token.

You should add those to your `src/app/config.ts` file:

```ts
export const config = {
  apiUrl: 'https://comem-citizen-engagement.herokuapp.com/api',
  // TODO: add the qimg URL and secret token to the configuration
  qimgUrl: 'https://comem-qimg.herokuapp.com/api',
  qimgSecret: 'changeme'
}
```

Do not forget to also update `src/app/config.sample.ts` to provide appropriate examples for other developers who might work on the project.



## Model

Here's model you might need.
Save it, for example to `src/models/qimg-image.ts`.
It represents the response from the qimg API when creating an image:

```ts
export class QimgImage {
  id: string;
  size: number;
  url: string;
  createdAt: string;
}
```



## Provider

Let's create a new provider that will be responsible for:

* Taking pictures.
* Uploading them to the qimg API.

You can generate it with this command:

```bash
$> ionic generate provider Picture
```

The following changes *should* have been made automatically to `src/app/app.module.ts`,
but make sure that's actually the case, or make the changes yourself if need be:

```ts
// Other imports...
// TODO: make sure the new provider has been imported
import { PictureProvider } from '../providers/picture/picture';

@NgModule({
  declarations: [ /* ... */ ],
  imports: [ /* ... */ ],
  bootstrap: [ /* ... */ ],
  entryComponents: [ /* ... */ ],
  providers: [
    // Other providers...
    // TODO: make sure the new provider has been added to the module's providers array
    PictureProvider
  ]
})
export class AppModule {}
```

**Replace the entire contents of `src/providers/picture/picture.ts`** with the following code:

```ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Observable } from 'rxjs/Observable';
import { switchMap, tap } from 'rxjs/operators';

import { config } from '../../app/config';
import { QimgImage } from '../../models/qimg-image';

/**
 * Service to take pictures and upload them to the qimg API.
 */
@Injectable()
export class PictureProvider {

  constructor(private camera: Camera, private http: HttpClient) {
    console.log('Hello PictureProvider Provider');
    console.log('@@@ http client', !!this.http);
  }

  /**
   * Takes a picture, uploads it to the qimg API, and returns the created image.
   *
   * Returns an observable that will emit the created QimgObject if the picture
   * has been taken and successfully uploaded to the qimg API. An error may be
   * emitted instead if the user does not take a picture of if the upload fails.
   */
  takeAndUploadPicture(): Observable<QimgImage> {

    // Take a picture.
    // This creates an observable of picture data.
    const pictureData$ = this.takePicture();

    // Once the picture has been taken, upload it to the qimg API.
    // This returns a new observable of the resulting QimgImage object.
    const uploadedImage$ = pictureData$.pipe(switchMap(data => this.uploadPicture(data)))

    // Once the picture has been uploaded, log a message to the console
    // indicating that all went well.
    // This does not change the observable stream.
    const debug$ = uploadedImage$.pipe(tap(image => console.log(`Successfully uploaded picture to ${image.url}`)));

    // Return the observable stream.
    return debug$;
  }

  /**
   * Launches the camera to take a picture.
   *
   * Returns an observable that will emit the raw picture data as a string
   * once the picture has been taken. An error may be emitted instead if the
   * user does not take a picture.
   */
  private takePicture(): Observable<string> {

    // Prepare camera options.
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    // Start taking a picture.
    // The promise will be resolved when the user has snapped and validated the picture.
    // It may be rejected if the user does not take a picture.
    const pictureDataPromise = this.camera.getPicture(options);

    // Convert the promise to an observable and return it.
    return Observable.fromPromise(pictureDataPromise);
  }

  /**
   * Uploads raw picture data to the qimg API.
   *
   * Returns an observable that will emit the created QimgImage object.
   * An error may be emitted instead if the upload fails.
   */
  private uploadPicture(pictureData: string): Observable<QimgImage> {

    const requestBody = {
      data: pictureData
    };

    const requestOptions = {
      headers: {
        Authorization: `Bearer ${config.qimgSecret}`
      }
    };

    return this.http.post<QimgImage>(`${config.qimgUrl}/images`, requestBody, requestOptions);
  }

}
```



## Usage

Here's an example of how to use the new provider in a sample `ExamplePage` component:

```ts
// Other imports...
// TODO: import the model and provider
import { QimgImage } from '../../models/qimg-image';
import { PictureProvider } from '../../providers/picture/picture';

@Component({
  selector: 'page-example',
  templateUrl: 'example.html',
})
export class ExamplePage {
  // TODO: add a picture field to the class
  picture: QimgImage;

  constructor(
    // Other constructor parameters...
    // TODO: inject the picture provider
    private pictureService: PictureProvider
  ) {
  }

  // ...

  // TODO: add a method to take a picture
  //       (replace it if you already have it)
  takePicture() {
    this.pictureService.takeAndUploadPicture().subscribe(picture => {
      this.picture = picture;
    }, err => {
      console.warn('Could not take picture', err);
    });
  }

}
```

Update the component's template and make sure you have:

* A button that calls the `takePicture()` method (you might already have it).
* An `<img>` tag that displays the uploaded picture's URL once available (replace the existing one if you already have it).

```html
<button ion-button (click)='takePicture()'>Take picture</button>
<img *ngIf='picture' [src]='picture.url' />
```



[qimg]: https://mediacomem.github.io/comem-qimg/
