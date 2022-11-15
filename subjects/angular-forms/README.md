# Angular Forms

<!-- slide-front-matter class: center, middle -->

## Summary

Get started with and understand the basics of forms in [Angular][angular].

This tutorial is a condensed version of Angular's [Tour of Heroes][angular-tour-of-heroes] tutorial and some of its [Developer Guide][angular-guide],
which you should both read to gain a deeper understanding of Angular.

<!-- slide-include ../../BANNER.md -->

**You will need**

- [Google Chrome][chrome] (recommended, any browser with developer tools will do)
- [Angular CLI][ng-cli] (to generate the blank app)

**Recommended reading**

- [Angular CLI][angular-cli-subject]
- [Angular][angular-subject]

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Getting started](#getting-started)
- [Forms](#forms)
  - [HTML validations](#html-validations)
  - [Creating a form](#creating-a-form)
    - [Updating the component](#updating-the-component)
    - [Listening to form submit events](#listening-to-form-submit-events)
  - [Checking the validation state](#checking-the-validation-state)
    - [Prevent the form's submission](#prevent-the-forms-submission)
    - [Disable the submit button](#disable-the-submit-button)
    - [Display an error message](#display-an-error-message)
      - [Dirty, pristine, touched, untouched](#dirty-pristine-touched-untouched)
    - [Set the input field background color to red](#set-the-input-field-background-color-to-red)
  - [Angular validators](#angular-validators)
  - [Custom validators](#custom-validators)
    - [Registering a custom validator](#registering-a-custom-validator)
    - [Using a custom validator](#using-a-custom-validator)
  - [Displaying different messages for different errors](#displaying-different-messages-for-different-errors)
  - [Asynchronous validators](#asynchronous-validators)
    - [Available username validator](#available-username-validator)
    - [Write the validation function](#write-the-validation-function)
    - [Prepare the logic](#prepare-the-logic)
    - [Implement the logic](#implement-the-logic)
    - [Wrap in a directive](#wrap-in-a-directive)
    - [Write the directive](#write-the-directive)
    - [Register the directive](#register-the-directive)
    - [Implement the logic](#implement-the-logic-1)
    - [Use the directive](#use-the-directive)
- [Reactive forms](#reactive-forms)
  - [Using reactive forms in the component](#using-reactive-forms-in-the-component)
    - [Form submition](#form-submition)
    - [Reacting to form value changes](#reacting-to-form-value-changes)
  - [Using reactive forms in the template](#using-reactive-forms-in-the-template)
  - [Reactive form validations](#reactive-form-validations)
    - [Custom validators in reactive forms](#custom-validators-in-reactive-forms)
  - [Which is better, reactive or template-driven?](#which-is-better-reactive-or-template-driven)
- [Resources](#resources)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Getting started

To follow along this tutorial, you'll need a blank Angular application.

Generate one using the Angular CLI following command, somewhere on your file system:

```bash
$> ng new angular-forms
```

Wait for it to finish (this can take several minutes), then head to the newly created folder and start the app:

```bash
$> cd ./angular-forms
$> npm start
```

## Forms

Angular provides **validation** services for forms and controls.
These validations are performed **client-side** for a better user experience: the user gets **instant feedback**.

However, keep in mind that although this provides a good user experience, it can easily be circumvented and thus **cannot be trusted**.

> **Server-side validation is still necessary** for a secure application.

Blank apps do not include Angular Forms capabilities ; you need to add them by importing the `FormsModule` in the module in which you want to use them.

In our case, it would be the `AppModule`. Open `app.module.ts` and add the following:

```ts
// ... previous imports
*import { FormsModule } from '@angular/forms';

@NgModule({
  /* ... */,
  imports: [BrowserModule, `FormsModule`],
  /* ... */
})
export class AppModule {}
```


### HTML validations

HTML 5 has [built-in validation attributes][html-input] to define validations on your HTML form inputs (e.g. `<input>`, `<textarea>`, etc):

| Attribute   | Description                     |
| :---------- | :------------------------------ |
| `min`       | Minimum value for a number      |
| `max`       | Maximum value for a number      |
| `minlength` | Minimum length for a string     |
| `maxlength` | Maximum length for a string     |
| `pattern`   | Regular expression for a string |
| `required`  | Required field                  |

You simply add them to the HTML tag:

```html
<input type="text" `required minlength="2" ` />
```

Usually the **browser** performs these validations.
But Angular **overrides** these and provide its own implementation.
This allows you to add **more complex validations and interaction**.

### Creating a form

Let's add a very simple greeting form to our app:

Open the `app.component.html` file, and replace its content with:

```html
<h1>Angular Forms</h1>
<form>
  <input type="text"
    placeholder="Who are you?"
    [(ngModel)]="greeting"
    name="greeting"
    required />
  <button type="submit">Submit</button>
</form>

<p>Hello {{ greeting }}</p>
```

Add a `greeting` property to the `AppComponent` in the `app.component.ts` file:

```ts
@Component({ /* ... */ })
export class AppComponent {
  `greeting: string;`
}
```

#### Updating the component

Let's now make it so that the greeting will only be displayed if submitted through the form.
We need to add a separate property to our component:

- The `greeting` property will represent the internal value of the input field.
- The `displayedGreeting` property will represent the submitted value (which will no longer be bound to the input field).

We also need a new `displayGreeting()` method which will take the current value of `greeting` and copy it to `displayedGreeting`:

```ts
// ...
export class AppComponent {
  // ...
  greeting: string;
* displayedGreeting: string;
  // ...

* displayGreeting() {
*   this.displayedGreeting = this.greeting;
*   console.log('Greeting displayed');
* }
}
```

#### Listening to form submit events

Update the component's template to reflect the fact that we now want to display `displayedGreeting` instead of `greeting`:

```html
<p *ngIf="displayedGreeting">
  Hello {{ displayedGreeting }}
</p>
```

Bind the new `displayGreeting()` method to the form's `submit` event to make it work:

```html
<form `(submit)="displayGreeting()" `></form>
```

### Checking the validation state

You might have noticed that we have marked the input field as **required**,
but that the user can **still submit the form** when it is invalid (i.e. the input field is empty).

That's not very user-friendly.
We're going to make the following improvements:

- **Prevent the form's submission** if it has invalid fields.
- **Disable the submit button** if the form has invalid fields.
- **Display an error message** when the greeting input field contains an invalid value.
- **Set the input field background color to red** if it contains an invalid value.

#### Prevent the form's submission

In Angular, any `<form>` tag is enriched by the [`NgForm`][angular-docs-ng-form] directive.
You can retrieve the instance of the directive attached to the form by using a [**template reference variable**][angular-template-reference-variable]
(`#greetingForm` in this example):

```html
<form `#greetingForm="ngForm"` (submit)="displayGreeting(`greetingForm`)">
  <!-- ... -->
</form>
```

We can now update the implementation of `displayGreeting()` to add this new argument.

[`NgForm`][angular-docs-ng-form] must be imported from `@angular/forms`.
This class provides, among other things, a `valid` (or `invalid`) property to check whether the complete form is valid:

```ts
*import { NgForm } from '@angular/forms';
// ...

displayGreeting(`form: NgForm`) {
  `if (form.valid) {`
    this.displayedGreeting = this.greeting;
    console.log('Greeting displayed');
  `}`
}
```

#### Disable the submit button

The `#greetingForm` template reference variable is already available in the template from the previous modification,
since we passed it to `displayGreeting()` as an argument.

You can also bind it to DOM elements or their attributes elsewhere in the template.

This time, we'll use [`NgForm`][angular-docs-ng-form]'s `invalid` property.
We simply have to bind the value of the `<button>` tag's `disabled` attribute to it:

```html
<button `[disabled]="greetingForm.invalid"` type="submit">Submit</button>
```
This way:
- When the form is **invalid** (`greetingForm.invalid` is true), the button should be **disabled** (`disabled` should be present).
- When the form is **valid** (`greetingForm.invalid` is false), the button should **not be disabled** (`disabled` should not be present).

#### Display an error message

We've seen that the `<form>` tag is **enriched** with the [`NgForm`][angular-docs-ng-form] **directive**,
and that it's possible to **retrieve that directive** to gain access to the **form's validation state**.

You can do the same with the `<input>` tag, by retrieving the field's [`NgModel`][angular-docs-ng-model]'s directive
(which you applied by using `[(ngModel)]='expression'`):

```html
<input type="text" placeholder="Who are you?" name="greeting"
  [(ngModel)]="greeting" required `#greetingInput="ngModel"` />
```

The `NgModel` directive also has the `valid` and `invalid` properties,
indicating whether that particular field is valid.
All we have to do is add an error message to the form, and, through judicious use of our old friend the `NgIf` directive,
only display the message when the field is invalid.

```html
<form #greetingForm="ngForm" (submit)="displayGreeting(greetingForm)">
  <!-- input -->
* <p *ngIf="greetingInput.invalid">
*   Name is required
* </p>
  <!-- button -->
</form>
```

##### Dirty, pristine, touched, untouched

That's nice, but the error message is displayed right away.
It makes sense, since the **initial value** of the input field **is actually invalid**.
But that's not very user-friendly.
Ideally, we would want the error message to be displayed **only once the user has interacted with the form**.

Enter the following `NgForm` and `NgModel` properties:

- `dirty` - A control is **dirty** if the user has **changed its value**.
- `pristine` - A control is **pristine** if the user has **not yet changed its value** (the opposite of `dirty`).
- `touched` - A control is **touched** if the user has triggered a **[`blur`][blur-event] event** on it.
- `untouched` - A control is **untouched** if the user has **not yet** triggered a **[`blur`][blur-event] event** on it (the opposite of `touched`).

Make the following change to only display the error message after the user has started typing:

```html
<p *ngIf="greetingInput.invalid` && greetingInput.dirty`">
  Name is required
</p>
```

#### Set the input field background color to red

Angular automatically **mirrors** many `NgModel` **properties** onto the HTML tag as **CSS classes**.
You can use these classes to **style** form elements according to the state of the form.

These are some of the supported classes ([full list][angular-form-control-status-classes]):

- `.ng-valid` or `.ng-invalid` is applied depending on whether the value is valid
- `.ng-pristine` or `.ng-dirty` is applied depending on whether the user has changed the value
- `.ng-untouched` or `.ng-touched` is applied depending on whether the user has triggered `blur` event

So when our field is invalid and dirty, it will have both the `.ng-invalid` and `.ng-dirty` CSS classes added to it.
All you need to do is modify `src/app/app.component.scss` to add a background color to input fields with this combination of classes:

```css
input.ng-invalid.ng-dirty {
  background-color: #ffc0c0;
}
```

### Angular validators

These are some of the validators provided **out of the box** by Angular:

- [`email`][angular-docs-email-validator] - Validates that a string is a valid e-mail address.
- [`min`][angular-docs-min-validator] & [`max`][angular-docs-max-validator] - Validate that a number is within the specified bound(s).
- [`min-length`][angular-docs-min-length-validator] & [`max-length`][angular-docs-max-length-validator] - Validate that a string's length is within the specified bound(s).
- [`pattern`][angular-docs-pattern-validator] - Validates that a value matches a regular expression.
- [`required`][angular-docs-required-validator] - Validates that a value is present.

Here's a few usage examples:

```html
<input `type="email"` name="email" />
<input type="number" name="age" `min="3" max="10"` />
<input type="text" name="firstName" `min-length="1" max-length="50"` />
<input type="text" name="lastName" `pattern="[a-zA-Z ]*"` />
<input type="text" name="occupation" `required` />
```

### Custom validators

These validators are nice, but you might need **more complex validations**.

That's why Angular allows you to implement [custom validators][angular-custom-validators].
Here's an example of a validator that ensures a string is not in a list of forbidden values:

Create a new `not-in.ts` file in `src/app/validators` with this content:

```ts
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function notInValidator(notIn: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // Check if the value is invalid.
    if (notIn.indexOf(control.value) >= 0) {
      // Return an error named after the validator if that is the case.
      return {
        notIn: { value: control.value },
      };
    }

    // Otherwise, all is well, there is no error.
    return null;
  };
}
```

#### Registering a custom validator

To use your validation function in a form, you need to wrap it in a directive. Create another file in `src/app/validators`, called for example `not-in.directive.ts` with this content:

```ts
import { Directive, Input } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from "@angular/forms";
import { notInValidator } from "./not-in";

@Directive({
  selector: "[notIn]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NotInValidatorDirective,
      multi: true,
    },
  ],
})
export class NotInValidatorDirective implements Validator {
  @Input() notIn: string[];

  validate(control: AbstractControl): ValidationErrors | null {
    return notInValidator(this.notIn)(control);
  }
}
```

#### Using a custom validator

You must register the new directive in the `declarations` array of the module that needs to use this directive, in our case, it's the `app.module.ts`:

> In a concrete application, you should instead create a Shared Module that will declare and export shared elements throughout your application (see [this tutorial][angular-shared-module], in French)

```ts
// Other imports...
*import { NotInValidatorDirective } from './validators/not-in.directive';

@NgModule({
  declarations: [AppComponent, `NotInValidatorDirective`],
  imports: [/* ... */],
  bootstrap: [/* ... */]
})
export class AppModule {}
```

You can then finally use it in the template:

```html
<input type="text" placeholder="Who are you?" [(ngModel)]="greeting"
  name="greeting" required #greetingInput="ngModel" `[notIn]="['Bob']"` />
```

> Notice that the `notIn` attribute must be bound to **an array of string**

### Displaying different messages for different errors

There's a little problem now.
Since our error message is displayed as soon as there's an error on the `greetingInput` field,
it always displays `Name is required`, even if the error is due to our new custom validator.

```html
<p *ngIf="`greetingInput.invalid` && greetingInput.dirty">
  Name is required
</p>
```

To fix that, use `greetingInput.hasError(<errorName: string>)` which is a method that checks if the given `errorName` is present in the `errors` array of the control.

That way you can react separately to the `required` validator's error and to the custom validator's `notIn` error:

```html
<p *ngIf="`greetingInput.hasError('required')` && greetingInput.dirty">
  Name is required
</p>
*<p *ngIf="greetingInput.hasError('notIn') && greetingInput.dirty">
* Name is forbidden
*</p>
```

> `notIn` is, in this case, the name of the `ValidationError`'s property returned by the `notInValidator` function

### Asynchronous validators

The validator we implemented is actually a function that matches Angular's [`ValidatorFn`][angular-docs-validator-fn] interface.
It is **synchronous**, i.e. it performs no I/O operation to validate its value and immediately returns its errors (or `null`):

```ts
(control: AbstractControl): `ValidationErrors | null`
```

It's also possible to create **asynchronous validators**.
For example, to check whether a **username is already taken**, you might have to **call your API**, which is an asynchronous operation.

In that case, your validator function must match the [`AsyncValidatorFn`][angular-docs-async-validator-fn] interface instead.
That is, instead of returning a `ValidationErrors` object, it must return either a **Promise or an Observable** of that object:

```ts
(control: AbstractControl): `Promise<ValidationErrors | null>`
                            | `Observable<ValidationErrors | null>`
```

That way, Angular will wait for the Promise to be resolved or for the Observable to emit the errors before updating the template.

#### Available username validator

Let's create an asynchronous validator that checks against a web service wether a `username` is available.

Since we're going to make HTTP requests, add the `HttpClientModule` to the `imports` array of your module. Open the `app.module.ts` file and add the following:

```ts
// ...previous imports
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [/* ... */],
  imports: [BrowserModule, FormsModule, `HttpClientModule`],
  bootstrap: [/* ... */],
})
export class AppModule {}
```

#### Write the validation function

This time, we cannot create a simple exported function: since we will make an Http request in this function, we need to have access to `HttpClient`. Let's instead create a **service** that will contain our new validation function, and declare a dependency to `HttpClient`.

With Angular CLI, create a `Username` service:

```bash
$> ng generate service validators/Username --skip-tests
```
Open the generated file and add the following:

```ts
import { Injectable } from '@angular/core';
*import { HttpClient } from '@angular/common/http';
*import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
*import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsernameService {
  constructor(`private http: HttpClient`) { }
* availabilityValidator(): AsyncValidatorFn {
*   return (control: AbstractControl): Observable<ValidationErrors | null> => {
*     return null;
*   };
* }
}
```
#### Prepare the logic

The webservice that we'll use is a simple URL that requires a `name` query param whose value is the username we want to check:

```none
https://us-central1-masrad-dfa.cloudfunctions.net/notIn?`name=john-doe`
```

It returns a JSON object with an `available` property set to `true` or `false` depending on wether the username is available.

```json
{ "available": true }
```

Let's create an interface for this response Object in our `username.service.ts` file, and a constant to store the web service URL:

```ts
// Imports

*interface Availability {
* available: boolean;
*}

*const SERVICE_URL = 'https://us-central1-masrad-dfa.cloudfunctions.net/notIn';

@Injectable({ providedIn: 'root' })
export class UsernameService {
  // ...
}
```
#### Implement the logic

Let's now make the validation logic:

```ts
// Imports

// Availability interface

const SERVICE_URL = 'https://us-central1-masrad-dfa.cloudfunctions.net/notIn';

@Injectable({ providedIn: 'root' })
export class UsernameService {

  constructor(private http: HttpClient) {}

  availabilityValidator(): AsyncValidatorFn {
*   return (control: AbstractControl): Observable<ValidationErrors | null> => {
*     return this.http
*       .get<Availability>(`${SERVICE_URL}?name=${control.value}`)
*       .pipe(
*         map((result) => {
*           return result.available ? null : { notAvailable: true };
*         })
*       );
*   };
  }
}
```

#### Wrap in a directive

Similarily to the previous custom validator, let's wrap this validation function in a new directive.

With the Angular CLI, create a new `IsAvailable` directive:

```bash
$> ng generate directive validators/IsAvailable --skip-tests
```
> This will create the new file and update the `app.module.ts` file to declare it there.

#### Write the directive

Open up the generated file and add a dependency on the `UsernameService` in the directive's constructor, and make the class implements the `AsyncValidator` interface:

> Also, change the default `selector` value

```ts
import { Directive } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors
} from '@angular/forms';
import { Observable } from 'rxjs';
import { UsernameService } from './username.service';

@Directive({ selector: `'[isAvailable]'` })
export class IsAvailableDirective `implements AsyncValidator` {

  constructor(`private usernameService: UsernameService`) {}

* validate(
*   control: AbstractControl
* ): Promise<ValidationErrors> | Observable<ValidationErrors> {
*   return null;
* }
}
```
#### Register the directive

We need to register our new directive as an asynchronous validator.

Let's do this by adding a `providers` property to the `@Directive` configuration object:

```ts
// Other imports
import { /* ... */, NG_ASYNC_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[isAvailable]',
* providers: [
*   {
*     provide: NG_ASYNC_VALIDATORS,
*     useExisting: IsAvailableDirective,
*     multi: true,
*   },
* ],
})
export class IsAvailableDirective implements AsyncValidator {
  // ...
}
```
> Note that this time, we provide our directive as an `NG_ASYNC_VALIDATORS` token, not an `NG_VALIDATORS`

#### Implement the logic

Let's now make the validation logic.

We simply need to call the `availabilityValidator` factory method on the `UsernameService` and call its result passing it the `control`:

```ts
// Imports

@Directive({ /* ... */ })
export class IsAvailableDirective implements AsyncValidator {

  constructor(private usernameService: UsernameService) {}

  validate(
    control: AbstractControl
  ): Promise<ValidationErrors> | Observable<ValidationErrors> {
*    return this.usernameService.availabilityValidator()(control);
  }
}
```
#### Use the directive

Now, we can add a new attribute to our `<input>` in the `app.component.html` template, and a new error message for this validation:

```html
<input /* other attributes */ [notIn]="['Bob']" `isAvailable` />
<!-- existing error messages -->
*<p *ngIf="greetingInput.hasError('notAvailable') && greetingInput.dirty">
* Name is not available
*</p>
```
> Two things to note here:
> - The `isAvailable` attribute does not need a value, since the list of unavailable usernames is stored in the web service
> - The name of the error `'notAvailable'` does not match the name of the directive, but rather the name of the `ValidationError` property returned in the validation function:
  ```ts
  validate(control: AbstractControl): Observable<ValidationErrors> {
      // ...
          return result.available ? null : { `notAvailable`: true };
      // ...
  }
  ```

## Reactive forms

The form we have seen so far is a [**template-driven form**][angular-template-driven-form].

In contrast, **reactive forms** are an Angular technique for creating forms in a **reactive programming** style.

They are provided by a separate module, the [`ReactiveFormsModule`][angular-docs-reactive-forms-module]. Let's add it to our `AppModule`'s `imports` array:

```ts
// Other imports
import { FormsModule, `ReactiveFormsModule` } from '@angular/forms';

@NgModule({
  declarations: [/* ... */],
  imports: [BrowserModule, FormsModule, HttpClientModule, `ReactiveFormsModule`],
  bootstrap: [/* ... */],
})
export class AppModule {}
```

### Using reactive forms in the component

With reactive forms, the form structure is also defined **with code in the component**.

Replace all the content of `app.component.ts` with the following:

```ts
import { Component } from '@angular/core';
import { `FormBuilder, FormGroup` } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  greeting: string;
  displayedGreeting: string;
  `greetingForm: FormGroup;`

  constructor(`private formBuilder: FormBuilder`) {
*   this.greetingForm = this.formBuilder.group({
*     // Define the greeting input and its default value
*     greeting: ['']
*   });
  }
}
```

#### Form submition

Since the form is built directly into the component, the method that is executed when it's submitted doesn't need an argument anymore.

It can be rewritten as follows:

```ts
// ...
export class AppComponent {
  // ...

  displayGreeting`()` {
    if (`this.greetingForm`.valid) {
      this.displayedGreeting = this.greeting;
    }
  }
}
```

#### Reacting to form value changes

Reactive forms do not use `ngModel`, so there won't be two-way binding with the template any longer.
There will only be **one-way binding** from the form group in the component to the template.

To be notified of changes in the form group, you can subscribe to its `valueChanges` property, which is an Observable:

```ts
// ...
export class AppComponent {
  // ...
  constructor(private formBuilder: FormBuilder) {
    // ...
*   this.greetingForm.valueChanges.subscribe(formValues => {
*     console.log('Greeting changed to', formValues.greeting);
*     this.greeting = formValues.greeting;
*   });
  }
}
```

### Using reactive forms in the template

With reactive forms, your **template** is somewhat **simplified**.
Remove `ngModel`, the validations, `#greetingForm` and `#greetingInput`.
You simply have to pass the form group created in the component to the `<form>` tag with the `formGroup` directive,
and use the `formControlName` directive on the `<input>` tag:

```html
<form `[formGroup]="greetingForm"` (submit)="`displayGreeting()`">
  <input type="text" placeholder="Who are you?" `formControlName="greeting"` />
  <!-- ... -->
</form>
```

You must also update your error messages to get the input field from the form group with `greetingForm.get("greeting")`
instead of using the `#greetingInput` template reference variable you just removed:

```html
<p *ngIf="`greetingForm.get('greeting')`.hasError('required') && `greetingForm.get('greeting')`.dirty">
  Name is required
</p>
<p *ngIf="`greetingForm.get('greeting')`.hasError('notIn') && `greetingForm.get('greeting')`.dirty">
  Name is forbidden
</p>
```

### Reactive form validations

The validations are no longer applied since we removed them from the template.
With reactive forms, **validation is configured in the component**:

```ts
// Other imports...
import { FormBuilder, FormGroup, `Validators` } from '@angular/forms';
*import { notInValidator } from '../validators';

@Component({/* ... */})
export class AppComponent {
  // ...
  constructor(private formBuilder: FormBuilder) {
    this.greetingForm = this.formBuilder.group({
      // Define the greeting input and its default value
*     greeting: [
*       '',
*       // Array of synchronous validators
*       [Validators.required, notInValidator(['Bob'])],
*       // Asynchronous validators (or array if multiple validators)
*       this.usernameService.availabilityValidator(),
*     ],
    });
    // ...
  }
  // ...
}
```

#### Custom validators in reactive forms

Note that we use our custom validator functions (`notInValidator` and `availabilityValidator`) directly,
instead of using the directives like before:

```ts
// Add validators to the field.
[
  Validators.required, // Use the built-in "required" validator.
  `notInValidator([ 'Bob' ])`, // Use our custom validator function.
],
`this.usernameService.availabilityValidator()`;
```

This is an advantage of reactive forms over template-driven forms:
validators can be **simple functions** that do not require an additional directive to be applied in the template.

> In the case of `availabilityValidator`, we need to add a dependency to the service that provides it

You can remove the directives (e.g. delete `not-in.directive.ts` and `is-available.directive.ts` and remove them from `declarations` in `src/app/app.module.ts`),
and the form will keep working.

### Which is better, reactive or template-driven?

In [**template-driven forms**][angular-forms], form structure and validation are specified and handled **in the template**:

- Creation of form controls is delegated to directives and asynchronous.
- Angular handles data updates with two-way binding.
- Hard to test with automated tests.

In [**reactive forms**][angular-reactive-forms], a tree of form control objects and validations is managed **in the component** and bound to elements in the template:

- The component class has immediate access to both the data model and the form control structure.
- Changes can be subscribed to in the form of Observables.
- Data and validity updates are synchronous and under your control.
- Easier to test with automated tests.

Neither is "better".
They're two different architectural paradigms, with their own strengths and weaknesses.
You may even use both in the same application.

**Read the documentation to learn more.**

## Resources

**Documentation**

- [Angular Tour of Heroes Tutorial][angular-tour-of-heroes]
- [Angular Developer Guide][angular-guide]
  - [Template-driven Forms][angular-forms]
  - [Reactive Forms][angular-reactive-forms]
- [Angular API reference][angular-api]

[angular]: https://angular.io
[angular-api]: https://angular.io/api
[angular-cli-subject]: ../angular-cli
[angular-custom-validators]: https://angular.io/guide/form-validation#custom-validators
[angular-docs-async-validator-fn]: https://angular.io/api/forms/AsyncValidatorFn
[angular-docs-email-validator]: https://angular.io/api/forms/EmailValidator
[angular-docs-max-length-validator]: https://angular.io/api/forms/MaxLengthValidator
[angular-docs-min-length-validator]: https://angular.io/api/forms/MinLengthValidator
[angular-docs-max-validator]: https://angular.io/api/forms/Validators#max
[angular-docs-min-validator]: https://angular.io/api/forms/Validators#min
[angular-docs-ng-form]: https://angular.io/api/forms/NgForm
[angular-docs-ng-model]: https://angular.io/api/forms/NgModel
[angular-docs-pattern-validator]: https://angular.io/api/forms/PatternValidator
[angular-docs-reactive-forms-module]: https://angular.io/api/forms/ReactiveFormsModule
[angular-docs-required-validator]: https://angular.io/api/forms/RequiredValidator
[angular-docs-validator-fn]: https://angular.io/api/forms/ValidatorFn
[angular-form-control-status-classes]: https://angular.io/guide/form-validation#control-status-css-classes
[angular-forms]: https://angular.io/guide/forms
[angular-guide]: https://angular.io/guide/architecture
[angular-subject]: ../angular
[angular-template-driven-form]: https://angular.io/guide/forms
[angular-template-reference-variable]: https://angular.io/guide/template-syntax#ref-vars
[angular-tour-of-heroes]: https://angular.io/tutorial
[angular-reactive-forms]: https://angular.io/guide/reactive-forms
[angular-shared-module]: https://guide-angular.wishtack.io/angular/project-structure-and-modules/shared-module
[blur-event]: https://developer.mozilla.org/en-US/docs/Web/Events/blur
[chrome]: https://www.google.com/chrome/
[html-input]: https://www.w3schools.com/tags/tag_input.asp
[ng-cli]: https://cli.angular.io/
[ion-input]: https://ionicframework.com/docs/api/input
[ion-checkbox]: https://ionicframework.com/docs/api/checkbox
