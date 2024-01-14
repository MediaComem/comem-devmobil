# COMEM+ Mobile Development Course

The goal of this course is to learn how to develop hybrid mobile applications,
that is web apps embedded into native wrappers for multiple platforms.
You will:

- Learn about hybrid mobile application development with [Ionic][ionic] and [Capacitor][capacitor]
- Learn the **core principles** of [Angular][angular]
- Design and develop a **frontend mobile application** optionally based on the API developed in the [previous course][archioweb]
- Add a **real-time** component to your hybrid mobile application
- Run the mobile application on your **phone** (ideally)

## What you will need

- A Unix CLI:
  - On Mac, the Terminal will do fine ;
  - On Windows, you should install [Git Bash][git-for-windows] (that comes with Git For Windows). You could also work with the [Windows Subsystem Linux (WSL)][install-wsl] but it requires more setup ;
- [Git][git-downloads] (on Windows, download and install [Git for Windows][git-for-windows] to install Git and Git Bash at the same time) ;
- A free [GitHub][github] account ;
- A web browser (recommended are [Edge][edge] or [Chrome][chrome], but any browser with developer tools will do) ;
- [Node.js][node] 20+ (latest Iron LTS version)
- Latest [Ionic CLI][ionic-cli] 7+
- An IDE or code editor of your choice (although [VS Code][vs-code] is **strongly** recommended)

## Plan

- [Introduction](./subjects/introduction)

- [Observables with Rxjs](./subjects/rxjs)

- Ionic

  - [TypeScript](./subjects/ts)
  - [Angular (Standalone)](./subjects/angular-standalone)
  - [Ionic navigation with Angular](./subjects/ionic-angular)

- App Development

  - Mockups
  - [Live setup][setup-project] (Tailored for the Travel Log subject with Angular, but it can help you kickstart your own app)

## Complementary subjects

- [Angular Forms With Ionic](./subjects/angular-forms-ionic)

- Extras

  - [Geolocation with Ionic](https://capacitorjs.com/docs/apis/geolocation)
  - [Taking pictures and uploading them to qImg](https://github.com/MediaComem/comem-devmobil/blob/master/IMAGE-UPLOAD.md#image-upload)
  - [Intergrating Leaflet with Angular](./subjects/angular-leaflet)

- Real-Time

  - [WebSocket](./subjects/websocket)

## Optional subjects

- [Javascript: basics and more](./subjects/js)
- [JavaScript: prototypes](./subjects/js-prototypes)
- [JavaScript: classes](./subjects/js-classes)
- [JavaScript: modules](./subjects/js-modules)
- [JavaScript: basic promises](./subjects/js-promises-basics)
- [JavaScript: advanced promises](./subjects/js-promises)
- [JavaScript: closures](./subjects/js-closures)
- [Advanced Angular](./subjects/advanced-angular)

## Useful links

- [Travel Log API Repository][travel-log-repo]
- [Travel Log API documentation][travel-log-api]
- [qimg API][qimg]

## Evaluation

**Features**

- A user must be able to register and/or log in (depending on the API's capabilities).
- A user must be able to manage the main resources of the API's domain model:
  - A user must be able to create new instances of all the main resources of the domain model (e.g. create Trips and Places in the Travel Log).
  - A user must be able to modify at least one of the resources of the domain model (e.g. update a Trip's title and description in the Travel Log).
  - A user must be able to delete at least one of the resources of the domain model (e.g. delete a Place in the Travel Log).
- At least two mobile-oriented features must be used, for example:
  - Geolocation of the user (e.g. to center a map on the user's location, or to determine a Place's location in the Travel log).
  - Pictures taken with the phone's camera.
    **You are not required to exclusively implement those two ; you can choose completly others ones depending on your subject**
- There must be a map showing geolocated resources (with more than one item on the same map).
- There must be a resource list with filters/search parameters.

**Implementation**

- The app must follow Angular and Ionic best practices.
- The app must use an approved API.
- Asynchronous code must be correctly handled (e.g. callbacks, promises and/or observables).
- The app must provide **clear feedback** (`console.error` calls are **NOT** clear feebacks...) to the user when errors are likely to occur:
  - When submitting a form (input might be invalid or the API call might fail).
  - When geolocating the user (it might fail).
- Secrets (passwords & keys) **must not** be committed to the Git repository.

**Presentation**

You must provide a presentation for your app.
This can be **either** in the form of a **user guide** or in the form of a **pitch** as if it were a real app that you were going to sell.
You can choose from the following options (one is enough):

- You can present the app in the README or the Wiki of the GitHub repository for the app.
- You can make a **webcast/video** demonstrating or selling your app.
- You can provide a tutorial **inside** the app.
- You can use any other presentation tool (subject to approval) but your user guide or pitch must be available online.

### Delivery

Each group must send an e-mail **at a yet-to-be-defined date (probably at the end of january)** to [Mathias Oberson](mailto:mathias.obserson@heig-vd.ch) with:

- The list of group members.
- The link to your source code repository on GitHub.
- The link to your webcast, presentation page or user guide (if it's not in the repository).

[angular]: https://angular.io
[archioweb]: https://github.com/MediaComem/comem-archioweb
[chrome]: https://www.google.com/chrome/
[capacitor]: https://capacitorjs.com/
[edge]: https://www.microsoft.com/en-us/edge
[git-downloads]: https://git-scm.com/downloads
[git-for-windows]: https://gitforwindows.org/
[github]: https://github.com
[ionic]: http://ionicframework.com
[ionic-cli]: https://ionicframework.com/docs/cli
[ionic-getting-started]: http://ionicframework.com/getting-started/
[node]: https://nodejs.org/
[qimg]: https://comem-qimg.onrender.com/doc
[setup-project]: https://github.com/MediaComem/comem-travel-log-ionic-setup
[travel-log-api]: https://demo-travel-log-api.onrender.com/
[travel-log-repo]:https://github.com/Tazaf/comem-travel-log-api
[vs-code]: https://code.visualstudio.com/
[install-wsl]: https://learn.microsoft.com/fr-fr/windows/wsl/install
