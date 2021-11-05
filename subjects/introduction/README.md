# Introduction

Learn about [Ionic][ionic], an open source framework to build hybrid mobile applications based on [Capacitor][capacitor] and [Angular][angular].

**You will need**

- [Node.js][node] 16+
- [Google Chrome][chrome] (recommended, any browser with developer tools will do)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Which OS (and version) should your app support?](#which-os-and-version-should-your-app-support)
- [Hybrid mobile applications](#hybrid-mobile-applications)
  - [Hybrid VS Native](#hybrid-vs-native)
    - [Native Development](#native-development)
    - [Hybrid Development](#hybrid-development)
  - [Capacitor](#capacitor)
    - [Other options](#other-options)
  - [What about Ionic?](#what-about-ionic)
    - [What can I do with Ionic?](#what-can-i-do-with-ionic)
- [Demo](#demo)
  - [Install Ionic](#install-ionic)
  - [Starter templates](#starter-templates)
- [Basics of Ionic](#basics-of-ionic)
  - [Components](#components)
  - [Component functionality](#component-functionality)
- [Running apps on your mobile device](#running-apps-on-your-mobile-device)
- [Resources](#resources)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Which OS (and version) should your app support?

**iOS version share**

<img src='./images/ios-share-2021.png' class='w100' />

[source](https://gs.statcounter.com/os-version-market-share/ios/mobile-tablet/switzerland)

**Android version share**

<img src='./images/android-share-2021.png' class='w100' />

[source](https://gs.statcounter.com/os-version-market-share/android/mobile-tablet/switzerland)

## Hybrid mobile applications

<!-- slide-column -->

Write your app with HTML, CSS and JavaScript, **like a website**:

<img src='images/html-css-js.png' class='w100' />

<!-- slide-column 10 -->

<p class='center' style='margin-top:150px;font-size:2em;'><i class='fa fa-arrow-right' aria-hidden='true'></i></p>

<!-- slide-column -->

Embed it into a **native application**:

<img src='images/native-app.png' class='w100' />

<!-- slide-container -->

Since you are writing a **web app**, you can access **web APIs** like the [Geolocation API][geolocation-api].

But since you are using a native wrapper, you can also access **device hardware** like the **camera** or the **accelerometer**, and you can do it **in JavaScript**, with the help of dedicated plugins.

### Hybrid VS Native

There's a lot of talk around mobile application development and wether or not you should go the hybdrid way, or stick to the native development.

_[Read](https://cdn2.hubspot.net/hubfs/3776657/Ionic%20eBook%20-%20Hybrid%20vs%20Native.pdf?utm_source=hs_automation&utm_medium=email&utm_content=60041551&_hsenc=p2ANqtz-8mI1bbQO8sbWgiIUWfi1RRmnzzqBAJm5p6pHYTW0-t1e6UMRbQAjFTlW77qlLCZkxParmZq0DfrkbiW9qEuTEpmKWFDk_Ns7RyfGVeXtMqnp8VxMM&_hsmi=60041551) [More](https://medium.com/@zwacky/hybrid-apps-are-slow-f3367d22e868) on the subject_

<!-- slide-column -->

<h4>Native Development</h4>

**Pros**

- Highest performances
- No dependencies to third-parties (access all of the features offered by the native SDK)

**Cons**

- One codebase/release cycle/team per platform
- Requires more resources, time and knowledge

<!-- slide-column -->

<h4>Hybrid Development</h4>

**Pros**

- One codebase for all platforms (mobile and desktop alike)
- Widely used and known technologies

**Cons**

- (Little) Less performant than native apps
- Access to native device capabilities limited by plugins

### Capacitor

<p class='center'><img src='images/capacitor.png' class='w35' style="margin-bottom: 25px" /></p>

> Capacitor is an open source native runtime for building Web Native apps.
> Create cross-platform iOS, Android, and Progressive Web Apps with JavaScript, HTML, and CSS.

#### Other options

Capacitor is not the only system that allows developing hybrid (or hybrid-like) mobile applications.

Here's a list of other technologies and why they were not chosen for this course:

- [Cordova](https://cordova.apache.org/) - The Ionic team developped Capacitor to replace Cordova
- [Microsoft Xamarin](https://dotnet.microsoft.com/apps/xamarin) - Uses .NET and C# for development
- [Google Flutter](https://flutter.dev/) - Uses [Dart](https://dart.dev/) under the hood and is relativaly new
- [Facebook React Native](https://facebook.github.io/react-native/) - Can only be used with React
- And [others](https://medium.com/datadriveninvestor/hybrid-mobile-app-development-frameworks-for-2019-ac56b1e65f29)...

### What about Ionic?

<!-- slide-column 35 -->

<img src='images/ionic.png' class='w100' style='margin-top:2em;' />

<!-- slide-column -->

> "Ionic Framework is the free, open source **mobile UI toolkit** for developing high-quality cross-platform apps for native iOS, Android, and the web—all from a single codebase."

<!-- slide-container -->

Ionic plugs together a JavaScript framework (**Angular, React, Vue, ...**), a library of **pre-made components** and the capabilities of the **Capacitor native bridge**.

<div class='center' style="display: flex; align-items: center; justify-content: space-between;">
  <img src='images/capacitor.png' height="150"/>
  <img src='images/ng-js-ts-html.png' height="200"/>
</div>

> Please note that we will be using **Angular** as the underlying framework in this course.

#### What can I do with Ionic?

Ionic lets you build web apps that **look and behave like native apps** with HTML, CSS and a JavaScript or a supported framework.

The same application can be deployed on the web (as a PWA or not), Android or iOS, and will adope the plateform's visual look and feel

<!-- slide-column -->

_A card component displayed on an iOS platform_

<img src='./images/ionic-card-ios.png' class="w80"/>

<!-- slide-column -->

_The same card displayed on an Android platform_

<img src='./images/ionic-card-android.png' class="w80"/>

## Demo

<!-- slide-front-matter class: center, middle, image-header -->

<p class='center'><img src='images/demo.jpg' /></p>

### Install Ionic

Ionic provides you a **CLI tool** that you should install globally with the following command:

```bash
$> npm install -g @ionic/cli
```

You're now ready to use Ionic.
Let's generate an app called `ionic-tabs-demo` with the `tabs` starter template, using `Angular` as the underlying framework:

```bash
$> cd /path/to/projects
$> ionic start ionic-tabs-demo tabs --type=angular
[All bunch of stuff going on... Just wait]

Your Ionic app is ready! Follow these next steps:

*- Go to your new project: cd ./ionic-tabs-demo
*- Run ionic serve within the app directory to see your app in the browser
- Run ionic capacitor add to add a native iOS or Android project using Capacitor
- Generate your app icon and splash screens using cordova-res --skip-config --copy
- Explore the Ionic docs for components, tutorials, and more: https://ion.link/docs
- Building an enterprise app? Ionic has Enterprise Support and Features: https://ion.link/enterprise-edition
```

> Follow the first two infos to see your app in your browser.

### Starter templates

There are other templates than `tabs`.
For example, this will generate an application with a sliding side menu:

```bash
$> cd /path/to/projects
$> ionic start ionic-sidemenu-demo sidemenu
```

You can also start with a much simpler template.
This will generate an app with just one page and a title,
then it's up to you to define your basic layout:

```bash
$> cd /path/to/projects
$> ionic start ionic-blank-demo blank
```

You will find many Ionic app templates shared by the community in the [Ionic market][ionic-market].

## Basics of Ionic

<!-- slide-front-matter class: center, middle -->

### Components

Ionic has many [UI components][ionic-components] you can use out of the box:

<!-- slide-column 65 -->

```html
<`ion-button`>Default</ion-button>
<ion-button `color="secondary"`>
  Secondary
</ion-button>
```

<!-- slide-column -->

<img src='images/ionic-button.png' />

<!-- slide-container -->

<!-- slide-column 65 -->

```html
<`ion-card`>
  <`ion-card-header`>
    <`ion-card-title`>Header</`ion-card-title`>
    <`ion-card-subtitle`>Sub</`ion-card-subtitle`>
  </`ion-card-header`>

  <`ion-card-content`>
    The British use the term "header",
    but the American term "head-shot"
    the English simply refuse to adopt.
  </`ion-card-content`>
</`ion-card`>
```

<!-- slide-column -->

<img src='images/ionic-card.png' />

<!-- slide-container -->

<!-- slide-column 65 -->

```html
<`ion-range`>
  <`ion-icon` slot="start" name="remove"></`ion-icon`>
  <`ion-icon` slot="end" name="add"></`ion-icon`>
</`ion-range`>
```

<!-- slide-column -->

<img src='images/ionic-range.png' />

### Component functionality

Many of these components are actually [**Angular components**][angular-components].
They not only look pretty, but they also bring **functionality**.

For example, the [`ion-item-sliding`][ionic-sliding-list] component automatically enables you to slide in controls from the side as most mobile applications do:

<!-- slide-column 65 -->

```html
<ion-item-options>
  <ion-item-option color="primary">
    <ion-icon name="text"></ion-icon>
    Text
  </ion-item-option>
  <ion-item-option color="secondary">
    <ion-icon name="call"></ion-icon>
    Call
  </ion-item-option>
  <ion-item-option color="primary">
    <ion-icon name="mail"></ion-icon>
    Email
  </ion-item-option>
</ion-item-options>
```

<!-- slide-column -->

<img src='images/ionic-list-features.png' />

## Running apps on your mobile device

Even if Ionic lets you develop and run your app on a browser, the final goal should be to build your app and run it on a actual mobile device.

How this can be achieved depends heavily on which mobile device and computer you actually have...

- Want to test your app on **an iOS device**? You'll **need a Mac** for that...
- Want to test your app on **an Android device**? Any computer will do

Whatever your setup, the Ionic documentation has dedicated walkthrough to set up your environment.

- [iOS Development][ionic-ios-dev]
- [Android Development][ionic-android-dev]

## Resources

**Documentation**

- [Capacitor requirements][capacitor-requirements]
- [Ionic][ionic-docs]
  - [Components][ionic-components]
  - [API Documentation][ionic-api-docs]

[adoptopenjdk]: https://adoptopenjdk.net/index.html
[angular]: https://angular.io
[angular-components]: https://angular.io/guide/architecture#components
[capacitor]: https://capacitorjs.com/
[chrome]: https://www.google.com/chrome/
[configure-cli-tools]: https://ionicframework.com/docs/installation/android#configuring-command-line-tools
[cordova]: https://cordova.apache.org
[capacitor-requirements]: https://capacitorjs.com/docs/getting-started/environment-setup
[geolocation-api]: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation
[ionic]: http://ionicframework.com
[ionic-api-docs]: https://ionicframework.com/docs/api/
[ionic-components]: https://ionicframework.com/docs/components/
[ionic-dev-app]: https://ionicframework.com/docs/appflow/devapp/
[ionic-docs]: https://ionicframework.com/docs/
[ionic-market]: https://market.ionicframework.com/
[ionic-sliding-list]: https://ionicframework.com/docs/api/item-sliding
[node]: https://nodejs.org/en/
[ionic-ios-dev]: https://ionicframework.com/docs/developing/ios
[ionic-android-dev]: https://ionicframework.com/docs/developing/android