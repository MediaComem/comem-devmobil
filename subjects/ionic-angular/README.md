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
  - [URL matching (1/3)](#url-matching-13)
  - [URL matching (2/3)](#url-matching-23)
- [Navigating to a page](#navigating-to-a-page)
  - [Link to other page](#link-to-other-page)
    - [What are you talking about?](#what-are-you-talking-about)
- [Nested pages](#nested-pages)
  - [Generate page in specific path](#generate-page-in-specific-path)
    - [We are missing something...](#we-are-missing-something)
    - [Relative routes](#relative-routes)
    - [The children are independant now](#the-children-are-independant-now)
    - [That's it!](#thats-it)
  - [Relative router link](#relative-router-link)
- ["Catch all" route](#catch-all-route)
- [Path placeholder](#path-placeholder)
  - [Component route information binding](#component-route-information-binding)
  - [Manually get the param](#manually-get-the-param)
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
CREATE src/app/hello/hello.page.scss (0 bytes)
CREATE src/app/hello/hello.page.html (300 bytes)
CREATE src/app/hello/hello.page.spec.ts (446 bytes)
CREATE src/app/hello/hello.page.ts (464 bytes)
UPDATE src/app/app.routes.ts (283 bytes)

NOTE: The "--dry-run" option means no changes were made.
```

The Ionic CLI tells us that it's **created** a bunch of files, and **updated** one.

_Let's see what all of this means._

### What did `generate` do?

Here is what executing the command did in our project:

- Created a `hello.page.scss` file to write your page's **style** into,
- Created a `hello.page.html` file to write your page's **HTML template** into,
- Created a `hello.page.spec.ts` file to write your page's tests into (_subject not covered in this course_),
- Created a `hello.page.ts` file containing your page **standalone class definition**, and referecing the previous `.html` and `.scss` files as your new page's template and style, respectively,
- Finally, updated the `app.route.ts` file to **add your new page to your app's root navigation**.

> Now is a good time to take a look at **how navigation's done in an Ionic/Angular app**.

## Navigation

**Mobile applications** developed with [Ionic][ionic] and [Angular][angular] uses the [Angular router][angular-router] for navigation.

This router uses a **URL based system**, meaning that your app will display pages depending on the current URL state.

> Even though Ionic apps on mobile devices **don't show any address bars**, they do use URLs internally.

The browser is a familiar model of application navigation:

- Enter a URL in the address bar and the browser navigates to a corresponding page.
- Click links on the page and the browser navigates to a new page.
- Click the browser's back and forward buttons and the browser navigates backward and forward through the history of pages you've seen.

With Ionic starter templates, base navigation is defined in the `app.routes.ts` file.

### Base navigation

The content of the `app.routes.ts` file for the **Blank Starter** (the simplest one with only one page) is as follow:

```ts
// imports omitted
export const routes: Routes = [
  {
    path: "home",
    loadComponent: () => import("./home/home.page").then((m) => m.HomePage),
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
];
```

And this `routes` array is used in `main.ts` file to configure the `Router`:

```ts
// imports omitted
bootstrapApplication(AppComponent, {
  providers: [
    // Previous providers
    `provideRouter(routes)`,
  ],
});
```

### Route definition (1/2)

Let's see how the routes are defined:

```ts
export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  { `path`: '', `redirectTo`: 'home', `pathMatch`: 'full' },
];
```

- `path` defines the URL path that, if matched, will trigger this route. A `path` of `''` means that it's the default route, matched when there is no path in the URL (like with `https://example.com`).
  > _The path of the URL is the part that comes right after the domain name ; in a URL like `https://example.com/foo`, the path would be `foo`._
- `redirectTo` makes a route redirecting to another route's path. Here, the URL `https://example.com` will redirect to `https://example.com/home`, as if the user directly accessed it.
- `pathMatch: full` is required with `redirectTo` and means that only URLs with the **exact same path** as the one defined for this route will match.

### Route definition (2/2)

Let's (continue to) see how the routes are defined:

```ts
export const routes: Routes = [
  {
    path: 'home',
    `loadComponent`: () => import('./home/home.page').then((m) => m.HomePage),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
```

`loadComponent` is used to **Lazy Load** a component, meaning that they will be loaded **only** when the user tries to access their associated path, instead of at the app's startup.

This is a _Good Practice™_, as it **speeds up** the start of your app (with the downside of minor few loads when first accessing the Lazy Loaded components).

Here, any URL with a path that **exactly matches** `home` will make Angular loads the `home.page` file, then return the `HomePage` component for it to be rendered.

### URL matching (1/3)

Now, suppose a user tries to access the URL `https://example.com/`.

The path that the router will try to match is `''`, since there is nothing after the domain name in our URL.

Looking at our routes definition in `app.routes.ts`, the `Router` will find a match:

```ts
{ path: '', redirectTo: 'home', pathMatch: 'full' }
```

This route will make the `Router` redirect the user to `https://example.com/home`, causing the router to start again and try and match this new URL using its path, which is now `home`.

### URL matching (2/3)

Looking again at the routes definition, the `Router` will find a match for the new path `home`:

```ts
{
  path: 'home',
  loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
}
```

This route causes the `HomePage` component to be rendered and displayed to the user, effectively stopping the router's quest for a match to the URL `https://example.com/home`.

## Navigating to a page

Let's add a new page to our app to see how we can navigate from one to the other.

From the root of your project, execute this command:

```bash
$> ionic generate page User
```

This generates a new page component in `src/app/user`, and updates the routes definition to include a route to this new page in `app.routes.ts`:

```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
* {
*   path: 'user',
*   loadComponent: () => import('./user/user.page').then( m => m.UserPage)
* },
];
```

### Link to other page

We will add a button in our `HomePage` that allow our users to navigate to the `UserPage`.

To do so, let's open the `home.page.html` file and **replace the content in the `div#container`**:

```html
<!-- Other HTML -->
<div id="container">
  <p>Welcome to the Home Page</p>
  <ion-button `routerLink="/user" `>Go to User Page</ion-button>
</div>
```

We added an [`ion-button`][ionic-button] tag with a [`routerLink`][angular-router-link] attribute.

- The `ion-button` tag is the selector for the `IonButton` component, which is an Ionic component.

- The `routerLink` directive is provided by Angular's `RouterModule` and allows the element to which it is attached to **make the app navigate to the given URL** when clicked by the user.

#### What are you talking about?

Currently, our app does not compile.

That is because the `HomePage` module has no idea what is an `ion-button`. We need to tell it that it's the selector of the `IonButton` component by adding this class to its `imports` array.

Similarily, `HomePage` does not know what `routerLink` is used for, thus clicking the button won't do anything at all. We need to tell it that it's from the `RouterModule` by also adding this class in the `imports`:

```ts
// Other imports omitted
*import { RouterModule } from '@angular/router';
import { `IonButton`, /* Previous imports */ } from '@ionic/angular/standalone';

@Component({
  // Other properties
  imports: [ /* Other classes */, `IonButton`, `RouterModule`],
})
export class HomePage {
  constructor() {}
}
```

> Now, if our app is accessible at `https://example.com`, clicking the button will make our app navigate to `https://example.com/user`, ultimately displaying the `UserPage` component to our user.

## Nested pages

Until now, all our pages where accessible with a simple path: `home`, `user`.

Let's say we want to add a `ProfilePage` as a **child** to our `UserPage`, and make it accessible through the `/user/profile` URL.

> It's a good idea to have our file tree matching our URL tree.

We could try to use once again the `ionic generate page` command. Let's do this with the `--dry-run` parameter to see if it does what we want:

```bash
$> `ionic generate page Profile --dry-run`
> ng generate page Profile --dry-run --project=app
CREATE `src/app`/profile/profile.page.scss (0 bytes)
CREATE `src/app`/profile/profile.page.html (304 bytes)
CREATE `src/app`/profile/profile.page.spec.ts (458 bytes)
CREATE `src/app`/profile/profile.page.ts (472 bytes)
*UPDATE src/app/app.routes.ts (468 bytes)

NOTE: The "--dry-run" option means no changes were made.
```

We see that this new page would be created in the `src/app` directory, and a new route would be added to the `app.routes.ts` file.

This is not what we'd like!

### Generate page in specific path

We want to create this new `ProfilePage` under the `src/app/user` directory, since it's a **child page** of the user page.

To do so, we can add a path before the name of our page when executing the `generate` command:

```bash
$> ionic generate page `user/`Profile --dry-run
```

> Notice that the path added before our page's name is always relative to the `src/app` folder.

#### We are missing something...

The result of the command is:

```bash
$> `ionic generate page user/Profile --dry-run`
> ng generate page user/Profile --dry-run --project=app
CREATE `src/app/user`/profile/profile.page.scss (0 bytes)
CREATE `src/app/user`/profile/profile.page.html (304 bytes)
CREATE `src/app/user`/profile/profile.page.spec.ts (458 bytes)
CREATE `src/app/user`/profile/profile.page.ts (472 bytes)
*UPDATE src/app/app.routes.ts (475 bytes)

NOTE: The "--dry-run" option means no changes were made.
```

The location of our files is correct (`src/app/user`), but the route would still added to `app.routes.ts` and, if we were to remove the `--dry-run` argument, it would look like this:

```ts
// Other imports
export const routes: Routes = [
  // Other routes
  { path: "user" /* loadComponent... */ },
  {
    path: "profile",
    loadComponent: () =>
      import("./user/profile/profile.page").then((m) => m.ProfilePage),
  },
];
```

#### Relative routes

The `generate page` command will, by default, create a route with **a `path` value equal to the new page name**, in the **closest** `*.routes.ts` file to where the new page would be generated.

Knowing this, we need to find a way for that route to be somehow **defined under the `user` path namespace**.

First, we can use the `children` property in the `user` route. This property must be a `Routes` definition array and each of those `Route`'s path will be relative to the parent path.

Let's do this in `app.routes.ts`:

```ts
// Imports omitted
export const routes: Routes = [
  // Previous routes
  {
    path: 'user',
*   children: [
*     {
*       path: '',
*       loadComponent: () => import('./user/user.page').then((m) => m.UserPage),
*     },
*   ],
  },
];
```

#### The children are independant now

Then, we can move the `Routes` declaration for all the routes under the `user` path into their own file. Let's create a new `src/app/user/user.routes.ts` file with this content (which is pretty much the value of the `children` property):

```ts
import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./user.page").then((m) => m.UserPage),
  },
];
```

Then, we update `app.routes.ts` to tell it to load this file when looking the `user` path's children:

```ts
// Imports omitted
export const routes: Routes = [
  // Previous routes
  {
    path: 'user',
*   loadChildren: () => import('./user/user.routes').then((m) => m.routes),
  },
];
```

#### That's it!

Everything looks good, we can execute the command without the `--dryRun` param:

```bash
$> ionic generate page user/Profile
```

The command will:

1. Generate the directory for the `ProfilePage` inside the `user` directory ;
2. Look for the **closest** routes definition file, which is now `user.routes.ts` ;
3. Add to the `Routes` array a new `Route` object with a path of `profile`.

Since the `user.routes.ts` contains the children routes for the `/user` routes, our `ProfilePage` will effectively be accessible with the `/user/profile` URL, which was our initial goal.

Phew.

### Relative router link

We've already seen a case where we used an **absolute link** (starting with a `/`) to tell the router where to navigate:

```html
<ion-button `routerLink="/user" `>Go to User Page</ion-button>
```

The `routerLink` attribute also support links that are **relative to the current route** (starting with a `./`).

Let's add a button in the `UserPage` template to navigate to the profile page. We know the profile page is a **child page** of the user page, thus we can use a link relative to the user page route.

**Replace** the content inside `ion-content` in `user.page.html` with the following _(don't forget to add `RouterModule` to the `imports` array in `user.page.ts`)_:

```html
<ion-button routerLink="./profile">Go to Profile Page</ion-button>
```

> The link value starts with `./` ; the router will thus append `profile` to the **current route**, which is `/user`, and search for a match to an URL of `http://example.com/user/profile`.

## "Catch all" route

If a user somehow accesses an URL that is unknown to our `Router`, this will raise an error in the console, saying `Error: Cannot match any routes`.

To prevent this you can define a "catch all" route, that will match **anything that hasn't matched** any preceding route, using the special `**` value (which means "everything") as the `path` of the route.

You can then either redirect all unknown URLs to a specific URL with the `redirectTo` property **or** create a dedicated component and use `loadComponent` to render it.

```ts
const routes: Routes = [
  // Previous routes
* { path: '**', redirectTo: '/', pathMatch: 'full' }
];
```

This way, URLs not matching a known route will redirect to the root of the app.

> Note that the **order** in which the routes are declared is **important**. If the highlighted route was in **first position**, all URLs would match its `path`, and nothing beside the `ErrorPage` would ever be displayed.

## Path placeholder

It's also possible to declare dynamic routes, with some parts of their `path` not statically known beforehand.

This could be the case for a product detail page:

- `https://example.com/product/12`
- `https://example.com/product/817`
- `https://example.com/product/9`

All those URLs would call the same component, with its actual content depending on the product `id` in the URL.

You can declare this kind of route like so:

> Run `ionic generate page Product` and change the `path` value

```ts
{
  path: `'product/:id'`, loadComponent: () => import('./product/product.page').then((m) => m.ProductPage),
}
```

The `:id` token in the `path` value declares a **path parameter** whose value will be the actual value in the URL (`12`, `817` or `9` in the above examples)

### Component route information binding

To easily access this route path parameter in our component, we can simply declare a property with the same name as the path parameter we want to access, and annotate this property with an `@Input` decorator. Let's do this in `product.page.ts`:

```ts
// Other imports
import { Component, `Input` } from '@angular/core';

@Component({ /* ... */ })
export class ProductPage {
* @Input() id?: string;
}
```

Then, we must configure our `Router` to handle this kind of bindings with the `withComponentInputBinding()` function. Let's do this in `main.ts`:

```ts
import { /* Other classes */, `withComponentInputBinding` } from '@angular/router';
// Omitted imports and code
bootstrapApplication(AppComponent, {
  providers: [
    // Other providers
    provideRouter(routes`, withComponentInputBinding()`),
  ],
});
```

### Manually get the param

Alternatively, you can manually access the param by injecting the [`ActivatedRoute`][angular-activated-route] service in your component's class, then get the value using the `snapshot.paramMap` property:

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
<ion-button `[routerLink]="['/product', product.id]" `>
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

| Method               | Interface       | Called when                                                                                                                                      |
| :------------------- | :-------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| `ngOnInit()`         | `OnInit`        | The component is being initialized                                                                                                               |
| `ionViewWillEnter()` | `ViewWillEnter` | The component is about to animate into view and become the active page.                                                                          |
| `ionViewDidEnter()`  | `ViewDidEnter`  | The component has finished animating into view and is now the active page. This event will fire, whether it was the first load or a cached page. |
| `ionViewWillLeave()` | `ViewWillLeave` | The component is about to animate out of view and no longer be the active page.                                                                  |
| `ionViewDidLeave()`  | `ViewDidLeave`  | The component has finished animating out of view and is no longer the active page.                                                               |
| `ngOnDestroy()`      | `OnDestroy`     | The component is being destroyed                                                                                                                 |

## Guarding routes

Angular also provides you with a mean of preventing unwanted navigation to routes by using special functions called `Guard`.

This is usefull for example if your app implements **authentication** and you want to prevent unauthenticated access to restricted pages.

A Guard can be used to prevent **four types of actions** on the route it is assigned to. Angular provide a type for each of them:

| Interface                                        | Action                                                                           |
| :----------------------------------------------- | :------------------------------------------------------------------------------- |
| [`CanActivateFn`][angular-can-activate]            | Check if **navigating to** or through **the route** is allowed                   |
| [`CanActivateChildFn`][angular-can-activate-child] | Check if **navigating to** or through any of **the route's children** is allowed |
| [`CanDeactivateFn`][angular-can-deactivate]        | Check if **navigating out** from **the route** is allowed                        |
| [`CanLoadFn`][angular-can-load]                    | Check if **lazy loading** of **this route's module** is allowed                  |

> All of those types define a function signature to implement that should return `true`/`false` values depending on wether the action is effectively allowed

### CanActivate

Let's see an example of a Guard function implementing the `CanActivateFn` type. Let's create a new `src/app/security/random.guard.ts` file and implement the function:

> Since a function can only be of one type, if you want to use the same function for multiple guard, you'll need to create a new function for each guard and have each of them call the function defining the logic.

```ts
import { CanActivateFn } from '@angular/router';

export const randomGuard: CanActivateFn = () => Math.random() >= 0.5;
```

You can then add this Guard function to the [`canActivate`][angular-route-can-activate] array of your route:

> Routes also have a dedicated `canActivateChild`, `canDeactivate` and `canLoad` properties. All of them requiring an array of applicable Guard as their value.

```ts
{ path: 'admin', `canActivate: [ randomGuard ]`, component: AdminPage }
```
> The route above is a theoretical example.

## Resources

**Documentation**

- [Ionic][ionic-docs]
  - [Navigation][ionic-nav-tutorial]
- [Angular][angular-docs]
  - [Routing & Navigation tutorial][angular-routing-navigation]
  - [Route Guard (french) tutorial][angular-route-guard]

[angular]: https://angular.dev
[angular-activated-route]: https://angular.dev/api/router/ActivatedRoute
[angular-can-activate]: https://angular.dev/api/router/CanActivateFn
[angular-can-activate-child]: https://angular.io/api/router/CanActivateChildFn
[angular-can-deactivate]: https://angular.io/api/router/CanDeactivateFn
[angular-can-load]: https://angular.io/api/router/CanLoadFn
[angular-docs]: https://angular.dev/docs
[angular-route-can-activate]: https://angular.dev/api/router/Route#canActivate
[angular-route-guard]: https://angular.fr/routing/guard.html
[angular-router]: https://angular.dev/api/router/Router
[angular-router-class]: https://angular.io/api/router/Router
[angular-router-link]: https://angular.io/api/router/RouterLink
[angular-routing-navigation]: https://angular.dev/guide/routing/common-router-tasks
[how-to-lazy-load]: https://blog.ionicframework.com/how-to-lazy-load-in-ionic-angular/
[ionic]: http://ionicframework.com
[ionic-button]: https://ionicframework.com/docs/api/button
[ionic-docs]: https://ionicframework.com/docs/
[ionic-nav-tutorial]: https://ionicframework.com/docs/angular/navigation
[ionic-generate]: https://ionicframework.com/docs/cli/commands/generate
[ionic-page-event]: https://ionicframework.com/docs/angular/lifecycle#ionic-page-events
[ng-route]: https://angular.dev/api/router/Route
[ng-generate]: https://angular.dev/cli/generate
