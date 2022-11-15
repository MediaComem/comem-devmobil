# Ionic navigation with Angular

Learn to work with [Angular][angular] in an [Ionic][ionic] project.

**Recommended reading**

- [Angular](../angular)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Scaffolding](#scaffolding)
  - [Generate app pages](#generate-app-pages)
  - [What did `generate` do?](#what-did-generate-do)
- [Navigation](#navigation)
  - [Base navigation](#base-navigation)
  - [Route definition (1/2)](#route-definition-12)
  - [Route definition (2/2)](#route-definition-22)
  - [HomePageModule](#homepagemodule)
    - [HomePageRoutingModule](#homepageroutingmodule)
  - [URL matching (1/3)](#url-matching-13)
  - [URL matching (2/3)](#url-matching-23)
  - [URL matching (3/3)](#url-matching-33)
- [Navigating to a page](#navigating-to-a-page)
  - [Link to other page](#link-to-other-page)
- [Nested pages](#nested-pages)
  - [Generate page in specific path](#generate-page-in-specific-path)
    - [That's it!](#thats-it)
  - [Check the paths](#check-the-paths)
  - [Relative router link](#relative-router-link)
- ["Catch all" route](#catch-all-route)
- [Path placeholder](#path-placeholder)
  - [Access path parameter](#access-path-parameter)
  - [Link to parametrized path](#link-to-parametrized-path)
- [Lifecycle hooks](#lifecycle-hooks)
- [Guarding routes](#guarding-routes)
  - [CanActivate](#canactivate)
- [Resources](#resources)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Scaffolding

The `ionic` command comes with its own [scaffolding sub-command, `generate`][ionic-generate],
which can help you quickly generate new application elements:

> You should be located at the root of your project before using this command

```bash
$> ionic generate --help

  ionic generate - Create Pages, Components, & Angular Features

    Automatically create framework features with Ionic Generate. This command uses the Angular CLI to generate features
    such as pages, components, directives, services, and more.

    - For a full list of available types, use npx ng g --help
    - For a list of options for a types, use npx ng g <type> --help

    You can specify a path to nest your feature within any number of subdirectories. For example, specify a name of
    "pages/New Page" to generate page files at src/app/pages/new-page/.

    To test a generator before file modifications are made, use the --dry-run option.
```

> Since `ionic generate` is based off of the `Angular CLI`, you're advised to also take a look at [its own `generate` command documentation][ng-generate].

### Generate app pages

Using the `ionic generate page <PageName>` command, you can set up the necessary code to add new pages to you app.

> Use CamelCase for the name of your page in the command

From the root of your project, use the following command to set up a "Hello" page:

> Add `--dry-run` at the end of your `generate` command if you want to test what the command would do, without actually doing it.

```ts
$> `ionic generate page Hello --dry-run`
> ng generate page Hello --dry-run --project=app
CREATE src/app/hello/hello-routing.module.ts (343 bytes)
CREATE src/app/hello/hello.module.ts (465 bytes)
CREATE src/app/hello/hello.page.scss (0 bytes)
CREATE src/app/hello/hello.page.html (124 bytes)
CREATE src/app/hello/hello.page.spec.ts (640 bytes)
CREATE src/app/hello/hello.page.ts (252 bytes)
UPDATE src/app/app-routing.module.ts (629 bytes)
NOTE: The "dryRun" flag means no changes were made.
```

The Ionic CLI tells us that it's **created** a bunch of files, and **updated** one.

_Let's see what all of this means._

### What did `generate` do?

Here is what executing the command did in our project:

- Created a `hello.page.html` file to write your page's **HTML template** into,
- Created a `hello.page.scss` file to write your page's **style** into,
- Created a `hello.page.ts` file containing your page **class definition**, and referecing the previous `.html` and `.scss` files as your new page's template and style, respectively,
- Created a `hello.page.spec.ts` file to write your page's tests into (_subject not covered in this course_),
- Created a `hello.module.ts` file containing **a module that declares your new page** and how to navigate to it (more on this later),
- Created a `hello-routing.module.ts` file defining **the navigation for this new page's module**,
- Finally, updated the `app-routing.module.ts` file to **add your new page to your app's root navigation**.

> Now is a good time to take a look at **how navigation's done in an Ionic/Angular app**.

## Navigation

**Mobile applications** developed with [Ionic][ionic] and [Angular][angular] uses the [Angular router][angular-router] for navigation.

This router uses a **URL based system**, meaning that your app will display pages depending on the current URL state.

> Even though Ionic apps on mobile devices **don't show any address bars**, they do use URLs internally.

From the [Angular Router documentation][angular-router]:

> The browser is a familiar model of application navigation:
>
> - Enter a URL in the address bar and the browser navigates to a corresponding page.
> - Click links on the page and the browser navigates to a new page.
> - Click the browser's back and forward buttons and the browser navigates backward and forward through the history of pages you've seen.

With Ionic starter templates, base navigation is defined in the `app-routing.module.ts` file.

### Base navigation

The content of the `app-routing.module.ts` file for the **Blank Starter** (the simplest one with only one page) is as follow:

```ts
// imports omitted for brevity
* const routes: Routes = [
*   { path: '', redirectTo: 'home', pathMatch: 'full' },
*   {
*     path: 'home',
*     loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
*   }
* ];

@NgModule({
  imports: [
    `RouterModule.forRoot`(`routes`, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

The `RouterModule.forRoot` method uses the `routes` constant to configure the `Router`'s top level navigation.

> We won't see what the second `forRoot` param is about, but you can learn more about it [here][how-to-lazy-load].

### Route definition (1/2)

Let's see how the routes are defined:

```ts
const routes: Routes = [
  { `path`: '', `redirectTo`: 'home', `pathMatch`: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  }
];
```

- `path` defines the URL path that, if matched, will trigger this route. A `path` of `''` means that it's the default route, matched when there is no path in the URL (like with `https://example.com`).
  > _The path of the URL is the part that comes right after the domain name ; in a URL like `https://example.com/foo`, the path would be `foo`._
- `redirectTo` makes a route redirecting to another route's path. Here, the URL `https://example.com` will redirect to `https://example.com/home`, as if the user directly accessed it.
- `pathMatch: full` is required with `redirectTo` and means that only URLs with the **exact same path** as the one defined for this route will match.

### Route definition (2/2)

Let's (continue to) see how the routes are defined:

```ts
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    `loadChildren`: () => import('./home/home.module').then( m => m.HomePageModule)
  }
];
```

`loadChildren` is used to **Lazy Load** modules, meaning that they will be loaded **only** when the user tries to access their associated path, instead of at the app's startup.

This is a _Good Practice™_, as it **speeds up** the start of your app (with the downside of minor few loads when first accessing the Lazy Loaded module).

Here, any URL with a path that **starts with** `home` will make Angular loads the `HomePageModule`. This module **MUST** have its own routes definition so that the Router can keep looking for a match with what remains of the initial path.

Let's see how the `HomePageModule` is defined to better understand what we're talking about.

### HomePageModule

The code for the `HomePageModule` in the starter is as follows:

```ts
// Other imports...
*import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    `HomePageRoutingModule`
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
```

We can see that the `HomePageModule` imports another module named `HomePageRoutingModule`. The name is obviously related to routing, and so navigation.

Let's see what's inside...

#### HomePageRoutingModule

This module is the equivalent of the `app-routing.module.ts` file, but for our new `HelloPage`. It's content should be as follows:

```ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelloPage } from './hello.page';

*const routes: Routes = [
*  { path: '', component: HelloPage }
*];

@NgModule({
  imports: [RouterModule.`forChild`(routes)],
  exports: [RouterModule],
})
export class HelloPageRoutingModule {}

```

- The only route defined in this module means that when the remaining path starts with `''` (i.e. nothing), then the `HomePage` should be rendered.
- Note the usage of the `forChild` method when importing the `RouterModule`, instead of `forRoot`. This is necesseray to indicate that the `routes` of the `HomePageRoutingModule` are child routes.

### URL matching (1/3)

Now, suppose a user tries to access the URL `https://example.com/`.

The path that the router will try to match is `''`, since there is nothing after the domain name in our URL.

Looking at the root routes (in `app-routing.module.ts`), the Router will find a match:

```ts
{ path: '', redirectTo: 'home', pathMatch: 'full' }
```

This route will make the Router redirect the user to `https://example.com/home`, causing the router to start again and try and match this new URL using its path, which is now `home`.

### URL matching (2/3)

Looking again at the root routes, the router will find a match for the new path `home`:

```ts
{
  path: 'home',
  loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
}
```

This route will make Angular asynchronously load the `HomePageModule`, which imports the `HomePageRoutingModule`, that defines additional navigation.

Now that it matched a route, the router will remove this route's path, `home`, from the path its trying to match, leaving a remaining path of `''` to match with one of the child routes defined the `HomePageRoutingModule`.

### URL matching (3/3)

Looking through the `HomePageRoutingModule` child routes for a match to the path `''`, the router will find one:

```ts
{ path: '', component: HomePage }
```

This route causes the `HomePage` component to be rendered and displayed to the user, effectively stopping the router's quest for a match to the URL `https://example.com/home`.

## Navigating to a page

Let's add a new page to our app to see how we can navigate from one to the other.

From the root of your project, execute this command:

```bash
$> ionic generate page User
```

This generates a new page component in `src/app/user`, and updates the root routes to include navigation to this new page in `app-routing.module.ts`:

```ts
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'hello',
    loadChildren: () => import('./hello/hello.module').then(m => m.HelloPageModule)
  },
* {
*   path: 'user',
*   loadChildren: () => import('./user/user.module').then(m => m.UserPageModule)
* }
];
```

### Link to other page

We will add a button in our `HomePage` that allow our users to navigate to the `UserPage`.

To do so, let's open the `home.page.html` file and replace the content in the `div#container`:

```html
<!-- Other HTML -->
<div id="container">
  <p>Welcome to the Home Page</p>
  <ion-button `routerLink="/user" `>Go to User Page</ion-button>
</div>
```

We added an [`ion-button`][ionic-button] tag with a [`routerLink`][angular-router-link] attribute.

This attribute is related to the Angular Router and allows the element to which it is attached to **make the app navigate to the given URL** when clicked by the user.

Provided that our app is accessible at `https://example.com`, clicking this new button will make our app navigate to `https://example.com/user`, ultimately displaying the `UserPage` component to our user.

## Nested pages

Until now, all our pages where accessible with a simple path: `home`, `user`.

Let's say we want to add a `ProfilePage` as a child to our `UserPage`, and make it accessible through the `/user/profile` URL.

We could try to use once again the `ionic generate page` command. Let's do this with the `--dry-run` parameter to see if it does what we want:

```bash
$> `ionic generate page Profile --dry-run`
> ng.cmd generate page Profile --dry-run
CREATE `src/app`/profile/profile-routing.module.ts (351 bytes)
CREATE `src/app`/profile/profile.module.ts (479 bytes)
CREATE `src/app`/profile/profile.page.html (126 bytes)
CREATE `src/app`/profile/profile.page.spec.ts (654 bytes)
CREATE `src/app`/profile/profile.page.ts (260 bytes)
CREATE `src/app`/profile/profile.page.scss (0 bytes)
*UPDATE src/app/app-routing.module.ts (735 bytes)

NOTE: The "dryRun" flag means no changes were made.
```

We see that this new page would be created in the `src/app` directory, and a new route would be added to the `app-routing.module.ts` file at the root level.

This is not what we'd like!

### Generate page in specific path

We want to create this new `ProfilePage` under the `src/app/user` directory, since it's a **child page** of the user page.

To do so, we can add a path before the name of our page when executing the `generate` command:

```bash
$> ionic generate page `user/`Profile --dry-run
```

> Notice that the path added before our page's name is always relative to the `src/app` folder.

#### That's it!

The result of the command is:

```bash
$> `ionic generate page user/Profile --dry-run`
> ng.cmd generate page user/Profile --dry-run
CREATE src/app/user/profile/profile-routing.module.ts (351 bytes)
CREATE src/app/user/profile/profile.module.ts (479 bytes)
CREATE src/app/user/profile/profile.page.html (126 bytes)
CREATE src/app/user/profile/profile.page.spec.ts (654 bytes)
CREATE src/app/user/profile/profile.page.ts (260 bytes)
CREATE src/app/user/profile/profile.page.scss (0 bytes)
UPDATE src/app/user/user-routing.module.ts (581 bytes)

NOTE: The "dryRun" flag means no changes were made.
```

The location of our files is correct, and the `user-routing.module.ts` has been updated.

Everything looks good, we can execute the command without the `--dryRun` param:

```bash
$> ionic generate page user/Profile
```

### Check the paths

First, open the `user/user-routing.module.ts` file and look at the `routes` constant:

```ts
const routes: Routes = [
  { path: "", component: UserPage },
  `{ path: 'profile', loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule) }`,
];
```

Then, open the `user/profile/profile-routing.module.ts` file:

```ts
// imports omitted for brevity
const routes: Routes = [
* { path: '', component: ProfilePage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
```

We should now be able to access this new page by directly entering this URL in the browser `https://example.com/user/profile`, or with a button in the `UserPage` template.

### Relative router link

We've already seen a case where we used an **absolute link** (starting with a `/`) to tell the router where to navigate:

```html
<ion-button `routerLink="/user" `>Go to User Page</ion-button>
```

The `routerLink` attribute also support links that are **relative to the current route** (starting with a `./`).

Let's add a button in the user page template to navigate to the profile page. We know the profile page is a **child page** of the user page, thus we can use a link relative to the user page route:

```html
<!-- user.page.html -->
<ion-content>
  <ion-button routerLink="./profile">Go to Profile Page</ion-button>
</ion-content>
```

> The link value starts with `./` ; the router will thus append `profile` to the **current route**, which is `/user`, and search for a match to an URL of `http://example.com/user/profile`.

## "Catch all" route

If a user maliciously or involontarily enter an URL that is unknown to our Router, this will raise an error in the console, saying `Error: Cannot match any routes`.

To prevent this (and display a nice 404 page instead), you can define a "catch all" route, that will match **anything that hasn't matched** any preceding route.

Do this by setting the `path` or the route to the special value `**` (which means "everything"):

```ts
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'hello', loadChildren: () => import('./hello/hello.module').then(m => m.HelloPageModule) },
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserPageModule) },
* { path: '**', component: ErrorPage }
];
```

This way, URLs that don't start with `/home` or `/user` wil display the `ErrorPage`.

> Note that the **order** in which the routes are declared is **important**. If the highlighted route was in **first position**, all URLs would match its `path`, and nothing beside the `ErrorPage` would ever be displayed.

## Path placeholder

It's also possible to declare dynamic routes, whose `path` value is not exactly known beforehand.

This could be the case if you want to display, for example, a product detail page with URL like those:

- `https://example.com/product/12`
- `https://example.com/product/817`
- `https://example.com/product/9`

All of them would display the same "page", with its actual content depending on the product `id` in the URL.

You can declare this kind of route like so:

```ts
{ path: 'product/:id', component: ProductDetailPage }
```

The `:id` token in the `path` value declares a **path parameter** that you can access in your component's code, and whose value will be the actual value in the URL (`12`, `817` or `9` in the above examples)

### Access path parameter

To access this `:id` path parameter from your code, you'll need to inject the [`ActivatedRoute`][angular-activated-route] service in your component's controller, and access the param value using its `snapshot.paramMap` property:

```ts
// imports omitted for brevity
@Component({ /* ... */ })
export class ProductPage  {

  productId: string;

  constructor(
*   private route: ActivatedRoute
  ) {
*   this.productId = this.route.snapshot.paramMap.get('id');
  }
}
```

> The value passed to `paramMap.get(...)` must be **the name of the param** as declared in the route's path, **without** the `:`.

> In this case `paramMap.get('id')` and **not** `paramMap.get(':id')`.

### Link to parametrized path

If you want to link to such a route from your templates, you can still use the [`routerLink`][angular-router-link] attribute, but will need to bind it with an array of path segments:

```html
<ion-button `[routerLink]="['/product', product.id]"`>
  {{ product.name }} Details
</ion-button>
```

You could also make the navigation from your component's code by injecting the [`Router`][angular-router-class] service in your component's controller:

```ts
export class ExamplePage {
  product: any;

  constructor(private router: Router) {
    this.product = await getProductOneWayOrAnother();
  }

  goToSimpleRoute() {
*   this.router.navigateByUrl('/home');
  }

  goToParametrizedRoute() {
*   this.router.navigate([ '/product', this.product.id ]);
  }
}
```

## Lifecycle hooks

Any component may implement any of these [lifecycle methods][ionic-page-event] to be notified of navigation events:

| Method             | Interface | Called when                                                                                                                                          |
| :----------------- | :--- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ngOnInit()`         | `OnInit` | The component is being initialized |
| `ionViewWillEnter()` | `ViewWillEnter` | The component is about to animate into view and become the active page.                                                                          |
| `ionViewDidEnter()`  | `ViewDidEnter` | The component has finished animating into view and is now the active page. This event will fire, whether it was the first load or a cached page. |
| `ionViewWillLeave()` | `ViewWillLeave` | The component is about to animate out of view and no longer be the active page.                                                                   |
| `ionViewDidLeave()`  | `ViewDidLeave` | The component has finished animating out of view and is no longer the active page.                                                                |
| `ngOnDestroy()` | `OnDestroy` | The component is being destroyed |

## Guarding routes

Angular also provides you with a mean of preventing unwanted navigation to routes by using special services called `Guard`.

This is usefull for example if your app implements **authentication** and you want to prevent unauthenticated access to restricted pages.

A Guard can be used to prevent **four types of actions** on the route it is assigned to, by **implementing** the related Angular provided **interface**:

| Interface                                        | Action                                                                           |
| :----------------------------------------------- | :------------------------------------------------------------------------------- |
| [`CanActivate`][angular-can-activate]            | Check if **navigating to** or through **the route** is allowed                   |
| [`CanActivateChild`][angular-can-activate-child] | Check if **navigating to** or through any of **the route's children** is allowed |
| [`CanDeactivate`][angular-can-deactivate]        | Check if **navigating out** from **the route** is allowed                        |
| [`CanLoad`][angular-can-load]                    | Check if **lazy loading** of **this route's module** is allowed                  |

> All of those interfaces define a single method to implement that should return `true`/`false` values depending on wether the action is effectively allowed

### CanActivate

Let's see an example of a Guard implementing the `CanActivate` interface.

> Note that one Guard can absolutely implement all the Guard interfaces. You don't have to create one Guard per interface.

```ts
// random-access.ts
// imports omitted for brevity
@Injectable({ providedIn: 'root' })
export class RandomAccessGuard implements CanActivate {

* canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
*   const value = Math.random();
*   return value >= 0.5 ? true : false;
* }
}
```
You can then use this Guard with the [`canActivate`][angular-route-can-activate] property of your route:

> Routes also have a dedicated `canActivateChild`, `canDeactivate` and `canLoad` properties. All of them requiring an array of applicable Guard as their value.

```ts
{ path: 'admin', `canActivate: [ RandomAccessGuard ]`, component: AdminPage }
```

## Resources

**Documentation**

- [Ionic][ionic-docs]
  - [Navigation][ionic-nav-tutorial]
- [Angular][angular-docs]
  - [Routing & Navigation tutorial][angular-routing-navigation]
  - [Route Guard (french) tutorial][angular-route-guard]

[angular]: https://angular.io
[angular-activated-route]: https://angular.io/api/router/ActivatedRoute
[angular-can-activate]: https://angular.io/api/router/CanActivate
[angular-can-activate-child]: https://angular.io/api/router/CanActivateChild
[angular-can-deactivate]: https://angular.io/api/router/CanDeactivate
[angular-can-load]: https://angular.io/api/router/CanLoad
[angular-docs]: https://angular.io/docs
[angular-route-can-activate]: https://angular.io/api/router/Route#canActivate
[angular-route-guard]: https://guide-angular.wishtack.io/angular/routing/route-guards
[angular-router]: https://angular.io/guide/router
[angular-router-class]: https://angular.io/api/router/Router
[angular-router-link]: https://angular.io/api/router/RouterLink
[angular-routing-navigation]: https://angular.io/guide/router#routing--navigation
[how-to-lazy-load]: https://blog.ionicframework.com/how-to-lazy-load-in-ionic-angular/
[ionic]: http://ionicframework.com
[ionic-button]: https://ionicframework.com/docs/api/button
[ionic-docs]: https://ionicframework.com/docs/
[ionic-nav-tutorial]: https://ionicframework.com/docs/angular/navigation
[ionic-generate]: https://ionicframework.com/docs/cli/commands/generate
[ionic-page-event]: https://ionicframework.com/docs/angular/lifecycle#ionic-page-events
[ng-route]: https://angular.io/api/router/Route
[ng-generate]: https://angular.io/cli/generate
