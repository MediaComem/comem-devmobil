# COMEM+ Mobile Development Course

The goal of this course is to learn how to develop hybrid mobile applications,
i.e. web apps embedded into native apps on multiple platforms.
You will:

* Learn about hybrid mobile application development with [Ionic][ionic] and [Cordova][cordova].
* Learn the **core principles** of [Angular][angular].
* Design and develop a **mobile application** optionally based on the API developed in the [previous course][archioweb].
* Learn the **basics of Unit Testing** with Angular.
* Add a **real-time** component to your hybrid mobile application.
* Run the mobile application on your **phone**.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Plan](#plan)
- [What you will need](#what-you-will-need)
- [Evaluation](#evaluation)
- [Useful links](#useful-links)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Plan

* Going further with JavaScript
  * [JavaScript prototypes](https://mediacomem.github.io/comem-devmobil/2019-2020/subjects/js-prototypes?home=MediaComem%2Fcomem-devmobil%23readme)
  * [JavaScript classes](https://mediacomem.github.io/comem-devmobil/2019-2020/subjects/js-classes?home=MediaComem%2Fcomem-devmobil%23readme)
  * [JavaScript modules](https://mediacomem.github.io/comem-devmobil/2019-2020/subjects/js-modules?home=MediaComem%2Fcomem-devmobil%23readme)
  * [JavaScript promises](https://mediacomem.github.io/comem-devmobil/2019-2020/subjects/js-promises?home=MediaComem%2Fcomem-devmobil%23readme)

* Ionic
  * [Introduction](https://mediacomem.github.io/comem-devmobil/2019-2020/subjects/ionic?home=MediaComem%2Fcomem-devmobil%23readme)
  * [TypeScript](https://mediacomem.github.io/comem-devmobil/2019-2020/subjects/ts?home=MediaComem%2Fcomem-devmobil%23readme)
  * [Angular](https://mediacomem.github.io/comem-devmobil/2019-2020/subjects/angular?home=MediaComem%2Fcomem-devmobil%23readme)
  * [Ionic navigation with Angular](https://mediacomem.github.io/comem-devmobil/2019-2020/subjects/ionic-angular?home=MediaComem%2Fcomem-devmobil%23readme)

* App Development
  * Mockups
  * [Live setup][setup-project] (Tailored for the Travel Log subject, but it can help you kickstart your own app)

* Additional JavaScript concepts
  * [JavaScript closures](https://mediacomem.github.io/comem-devmobil/2019-2020/subjects/js-closures?home=MediaComem%2Fcomem-devmobil%23readme)

* Ionic (advanced)
  * [Ionic extras (geolocation, leaflet & camera)](https://mediacomem.github.io/comem-devmobil/2019-2020/subjects/ionic-extras?home=MediaComem%2Fcomem-devmobil%23readme)
  * [Image upload](./IMAGE-UPLOAD.md)

## What you will need

* A Unix CLI like Terminal on Mac, Git Bash or equivalent on Windows (avoid WSL as it does not work well with Ionic for now)
* [Git][git-downloads]
* A free [GitHub][github] account
* [Google Chrome][chrome] (recommended, any browser with developer tools will do)
* [Node.js][node] 10+
* [Ionic][ionic-getting-started]
* An IDE or code editor of your choice (although I strongly recommend using [VS Code][vs-code] when working with Typescript)

## Evaluation

**Features**

* A user must be able to register and/or log in (depending on the API's capabilities).
* A user must be able to manage the main resources of the API's domain model:
  * A user must be able to create new instances of all the main resources of the domain model (e.g. create Trips and Places in the Travel Log).
  * A user must be able to modify at least one of the resources of the domain model (e.g. update a Trip's title and description in the Travel Log).
  * A user must be able to delete at least one of the resources of the domain model (e.g. delete a Place in the Travel Log).
* At least two mobile-oriented features must be used, for example:
  * Geolocation of the user (e.g. to center a map on the user's location, or to determine a Place's location in the Travel log).
  * Pictures taken with the phone's camera (works only on physical devices).
  > You are not required to exclusively implement those two ; you can choose others depending on your subject
* There must be a map showing geolocated resources (with more than one item on the same map).
* There must be a resource list with filters or search parameters.

**Implementation**

* The app must follow Angular and Ionic best practices.
* The app must use an approved API.
* Asynchronous code must be correctly handled (e.g. callbacks, promises and/or observables).
* The app must provide clear feedback when errors are likely to occur:
  * When submitting a form (input might be invalid or the API call might fail).
  * When geolocating the user (it might fail).
* Secrets (passwords & keys) **must not** be committed to the Git repository.

**Presentation**

You must provide a presentation for your app.
This can be **either** in the form of a **user guide** or in the form of a **pitch** as if it were a real app that you were going to sell.
You can choose from the following options (one is enough):

* You can present the app in the README or the Wiki of the GitHub repository for the app.
* You can make a **webcast/video** demonstrating or selling your app.
* You can provide a tutorial **inside** the app.
* You can use any other presentation tool (subject to approval) but your user guide or pitch must be available online.
* You can upload your app to a store (e.g. Google Play), and write the store page as you would for a real app.
  > This last one is kind of tough, you've been warned

### Delivery

Each group must send an e-mail **no later than 26th of january 2020** to [Mathias Oberson](mathias.oberson@heig-vd.ch) with:

* The list of group members.
* The link to your source code repository on GitHub.
* The link to your webcast, presentation page or user guide (if it's not in the repository).

## Useful links

* [Travel Log API documentation][travel-log-api]
* [Ionic setup][setup-project] ([completed starter project][starter-project])
* [qimg API][qimg]
* [TypeScript support in Atom](ATOM-TYPESCRIPT.md)

[angular]: https://angular.io
[archioweb]: https://github.com/MediaComem/comem-archioweb
[chrome]: https://www.google.com/chrome/
[cordova]: https://cordova.apache.org
[github]: https://github.com
[git-downloads]: https://git-scm.com/downloads
[ionic]: http://ionicframework.com
[ionic-getting-started]: http://ionicframework.com/getting-started/
[node]: https://nodejs.org/
[setup-project]: https://github.com/MediaComem/comem-travel-log-ionic-setup
[starter-project]: https://github.com/MediaComem/comem-travel-log-ionic-starter
[travel-log-api]: https://comem-travel-log-api.herokuapp.com
[vs-code]: https://code.visualstudio.com/

<!-- Unused links -->
[angular-leaflet-directive]: https://github.com/tombatossals/angular-leaflet-directive
[angularjs-geolocation]: https://github.com/arunisrael/angularjs-geolocation
[comem]: http://www.heig-vd.ch/comem
[heig]: http://www.heig-vd.ch
[mapbox]: https://www.mapbox.com
[qimg]: https://mediacomem.github.io/comem-qimg/
