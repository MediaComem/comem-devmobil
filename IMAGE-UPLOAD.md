# Image Upload

You can use any image upload service you like.
The [qimg API][qimg] is a limited service provided for this course.

## Limitations

- Images cannot be larger than 2MB
- Each user has a quota: a maximum number of images they can upload

  The quota is 10 by default.
  When you start uploading more than 10 images, older images will be deleted.

## Configuration

You should have received a qimg authentication token that grants you access to the qimg API.

There are two new configuration properties your app needs to have:

- The URL to the qimg API.
- The qimg API authentication token.

You should add those to your `src/environments/environment.ts` file:

```ts
export const environment = {
  production: false,
  apiUrl: "<your-api-url>",
  // TODO: add the qimg URL and secret token to the configuration
  qimgUrl: "https://comem-qimg.onrender.com/api",
  qimgSecret: "<change-with-your-token>",
};
```

Do not forget to also update `src/environments/environment.sample.ts` to add those new properties for other developers who might work on the project.

## Model

Here's a model you might need, which represents image data as returned by the qImg API.

Create a new file where you want in your app's file structure and copy the following code there.

> It represents the response from the qimg API when creating an image:

```ts
export type QimgImage = {
  id: string;
  size: number;
  url: string;
  createdAt: string;
};
```

## Requirements

**To properly take pictures, you will need the [Capacitor Camera Plugin](https://capacitorjs.com/docs/apis/camera#capacitorcamera) and [Ionic PWA Elements](https://capacitorjs.com/docs/web/pwa-elements) plugin.**

> The PWA Elements plugin will simulate native features on your browser.

To install those, run :

```bash
$> npm i @capacitor/camera
$> ionic cap sync
$> npm i @ionic/pwa-elements
```

Then, you will need to update the content of the `src/main.ts` file to add the PWA elements:

```ts
// Other imports...
import { defineCustomElements } from "@ionic/pwa-elements/loader";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(() => defineCustomElements(window)) // Add this line
  .catch((err) => console.log(err));
```

## Service

Now, let's create a service that will be responsible for:

- Taking pictures.
- Uploading them to the qimg API.

You can generate it with this command:

```bash
$> ionic generate service picture/Picture --skip-tests=true
```

> This will generate the service in `src/app/picture`. Change the path at will.

**Replace the entire contents of `src/app/picture/picture.ts`** with the following code:

> Don't forget to also **READ** the code to better understand what's going on and adapt it to your needs.

```ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  ImageOptions,
  Photo,
} from '@capacitor/camera';
import { Observable, from } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { QimgImage } from '../models/qimg-image.model';

/**
 * Service to take pictures and upload them to the qimg API.
 */
@Injectable({ providedIn: 'root' })
export class PictureService {
  constructor(private http: HttpClient) {}

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
    return this.takePicture().pipe(
      // Once the picture has been taken, upload it to the qimg API.
      // This returns a new observable of the resulting QimgImage object.
      switchMap((data) => this.uploadPicture(data.base64String)),
      // Once the picture has been uploaded, log a message to the console
      // indicating that all went well.
      // This does not change the observable stream and you can delete this
      // if you don't want to log the URL to the image
      tap((image) =>
        console.log(`Successfully uploaded picture to ${image.url}`)
      )
    );
  }

  /**
   * Launches the camera to take a picture.
   *
   * Returns an observable that will emit the raw picture data as a string
   * once the picture has been taken. An error may be emitted instead if the
   * user does not take a picture.
   */
  private takePicture(): Observable<Photo> {
    // Prepare camera options.
    const options: ImageOptions = {
      quality: 50,
      resultType: CameraResultType.Base64,
      // You could also user Photos (to select from the gallery)
      // or Prompt to let the user decide. Your choice.
      source: CameraSource.Camera,
    };

    // Start taking a picture.
    // The promise will be resolved when the user has snapped and validated the picture.
    // It may be rejected if the user does not take a picture.
    const pictureDataPromise = Camera.getPhoto(options);

    // Convert the promise to an observable and return it.
    return from(pictureDataPromise);
  }

  /**
   * Uploads raw picture data to the qimg API.
   *
   * Returns an observable that will emit the created QimgImage object.
   * An error may be emitted instead if the upload fails.
   */
  private uploadPicture(base64: string | ArrayBuffer): Observable<QimgImage> {
    const requestBody = {
      data: base64,
    };

    const requestOptions = {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `Bearer ${environment.qimgSecret}`,
      },
    };

    return this.http.post<QimgImage>(
      `${environment.qimgUrl}/images`,
      requestBody,
      requestOptions
    );
  }
}
```

Update the component's template and make sure you have:

- A button that calls the `takePicture()` method (you might already have it).
- An `<img>` tag that displays the uploaded picture's URL once available (replace the existing one if you already have it).

```html
<ion-button (click)="takePicture()">Take picture</ion-button>
<img *ngIf="picture" [src]="picture.url" />
```

[qimg]: https://comem-qimg.onrender.com/doc
