# Advanced Angular

<!-- slide-front-matter class: center, middle -->

## Summary

Learn about more advanced [Angular][angular] concept.

<!-- slide-include ../../BANNER.md -->

**You will need**

* [Google Chrome][chrome] (recommended, any browser with developer tools will do)

**Recommended reading**

* [Angular][angular-subject]

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Custom attribute directives](#custom-attribute-directives)
  - [Using an attribute directive](#using-an-attribute-directive)
  - [Modifying the DOM](#modifying-the-dom)
- [Custom pipes](#custom-pipes)
  - [Using a pipe](#using-a-pipe)
  - [Pipe parameters](#pipe-parameters)
- [Resources](#resources)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Custom attribute directives

An **attribute** directive changes the **appearance or behavior of a DOM element**.

> **Angular CLI**: Use `ng generate directive <DirectiveName>` to create all the files for a new directive

Create a `src/app/highlight.directive.ts` file with the following contents:

```ts
import { Directive } from '@angular/core';

`@Directive`({
  selector: '[appHighlight]'
})
export `class HighlightDirective` {
  constructor() {
    console.log('the highlight directive was used');
  }
}
```

Similarly to a component, a directive is a JavaScript class, this time annotated with the [`@Directive`][angular-docs-directive] decorator.

The selector, `[appHighlight]` is an [attribute selector][css-attribute-selector]. It's a good practice to prefix the selector ("app" for this example) to avoid **naming collisions**.

### Using an attribute directive

To use your new attribute directive, you must **declare** it in your module's `declarations` array in `src/app/app.module.ts`:

```ts
*import { HighlightDirective } from './highlight.directive';
// Other imports...

@NgModule({
  declarations: [
    AppComponent,
    `HighlightDirective`
  ],
  // ...
})
export class AppModule { }
```

Now all you need to do is add the attribute to an element in `src/app/app.component.html`.
Let's add it to the greeting.

```html
<h1 [title]='titleComment' (click)='onTitleClicked($event)' `appHighlight`>
  Welcome to {{ title }}!
</h1>
```

You should see the directive being used in the console after entering some text in the input field.

### Modifying the DOM

Now add an `ElementRef` argument to the directive's constructor in `src/app/highlight.directive.ts`:

```ts
import { Directive, `ElementRef` } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  constructor(`el: ElementRef`) {
    `el.nativeElement.style.backgroundColor = 'yellow';`
  }
}
```

Doing this **injects** a reference to the host DOM element, the element to which you applied the `appHighlight` attribute.

`ElementRef` grants direct access to the host DOM element through its `nativeElement` property.
In this example we set the background color to yellow.

## Custom pipes

Let's implement an (amazing) pipe that adds an exclamation point to the end of a string:

> **Angular CLI**: Use `ng generate pipe <PipeName>` to create all the files for a new pipe

Create a `src/app/pipes/exclamation.pipe.ts` file with the following contents:

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'exclamation'
})
export class ExclamationPipe implements PipeTransform {
  transform(value: any, args?: any): any {
*   return \`${value}!`;
  }
}
```

### Using a pipe

To use your new pipe, you must **declare** it in your module's `declarations` array in `src/app/app.module.ts`:

```ts
// Other imports...
*import { ExclamationPipe } from './pipes/exclamation.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HighlightDirective,
    `ExclamationPipe`
  ],
  // ...
})
export class AppModule { }
```

Using the pipe is as simple as "piping" an interpolated value into it with the pipe (`|`) character in a template.
You can do that in `src/app/app.component.html`, then type some text in the input field to see it:

```html
<p>
  {{ hello(greeting)` | exclamation` }}
</p>
```

### Pipe parameters

Pipe can also take **parameters**.
Let's add a number parameter to allow customizing the number of exclamation points in `src/app/pipes/exclamation.pipe.ts`:

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'exclamation'
})
export class ExclamationPipe implements PipeTransform {
  transform(value: any`, strength: number = 1`): any {
*   const exclamation = '!'.repeat(strength);
*   return \`${value}${exclamation}`;
  }
}
```

Parameters are passed to pipes by appending `:value` to them in the template in `src/app/app.component.html`:

```html
<p>
  {{ hello(greeting) | exclamation`:3` }}
</p>
```


## Resources

**Documentation**

* [Angular Tour of Heroes Tutorial][angular-tour-of-heroes]
* [Angular Developer Guide][angular-guide]
* [Angular API reference][angular-api]

[angular]: https://angular.io
[angular-api]: https://angular.io/api
[angular-docs-directive]: https://angular.io/api/core/Directive
[angular-guide]: https://angular.io/guide/architecture
[angular-subject]: ../angular
[angular-tour-of-heroes]: https://angular.io/tutorial
[chrome]: https://www.google.com/chrome/
[css-attribute-selector]: https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors
