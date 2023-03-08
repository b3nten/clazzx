![clazzx](/.github/clazzx.png)

# Introduction

ClazzX is a small typesafe utility library for composing HTML classes. Unlike Vanilla Extract, Stitches, or CVA (all fantastic options) ClazzX takes a different approach, using *state* rather than *variants* to compose styles.

The classic approach is to create a series of variants that can be selected: 
```ts 
className={myButton({size: "small", intent="primary"})}
// AND
<Button size="small" intent="primary" />
```
In comparison, ClazzX models combinations of styles based on state.
```ts
className={MyButton.compose({small: true, primary: true})}
// AND
<Button small primary />
```
This simplifies the logic of tying the styling of a component to complex state. Instead of a series of nested ternary operators, simple logical operators can be used to clearly define the appropriate styles.

```ts
className={
   MyButton.compose({ 
       primary: true,
       loading: isLoading,
       error: isError 
   })
}
//AND
<Button primary loading={isLoading} error={isError}>

// Versus the traditional variant approach

className={
   myButton({
      intent: isLoading ? "loading" 
      : isError ? "error" 
      : "primary"
   })
}
// AND
<Button intent={isLoading ? "loading" : isError ? "error" : "primary"}>
```

# Installation
```ts 
// Deno
import { ClazzX, clx } from "https://deno.land/x/clazzx/mod.ts"

// NPM
npm i clazzx

// Yarn
yarn add clazzx
```
# Getting Started

## A basic component

```ts
import { ClazzX } from 'clazzx'

class Input extends ClazzX {
   // the base class will always be applied
   base = "border rounded-md font-sans"

   small = "px-2 py-1 text-sm"
   md = "px-3 py-2 text-base"
   lg = "px-4 py-3 text-lg"

   // you can use both strings and string arrays freely
   primary = [
      "bg-primary",
      "border-primary-dark",
      "text-primary-content"
   ]
   secondary = [
      "bg-secondary",
      "border-secondary-dark",
      "text-secondary-content"
   ]
}

function MyCustomComponent(){
   return <input className={Input.compose({ md: true, secondary: true })}/>
}
```
## Default Classes
You can set default classes that are applied if nothing is passed to the classes method.
```ts
default = [this.md, this.secondary, "hover:scale-105"]
```
## Compounds
If you want to conditionally apply styles when two or more states are true, you can create compound states.
```ts
compounds = [{
   state: ["primary", "large"],
   classes: "shadow-md"
}]
```

## Ordering
Classes are applied in the order of the states.
```ts
className={btn.compose({rounded: true, square: true})}
// className="border-md border-none"
<Button primary secondary small medium>
// className="bg-primary bg-secondary text-sm text-md"
```
The order of classes works like this:
1. `base`
3. ...order based on state `||` default classes
4. Compounds

## StyleProps
StyleProps is an exported type that gives you access to the parameters of the style class. You can use this to strongly type components.
```ts
function MyButton({...props}: StyleProps<MyStyleClass>){}
```

## Clx

`clx` is a variadic utility function that composes a string based on it's truthy inputs. 

```ts
const a = clx(["bg-green-300", "text-md"])
// "bg-green-300 text-md"

const b = clx("bg-red-300", false && "text-red-700")
// "bg-red-300"

const c = clx(["p-4", false && "mt4"], "text-black", true && "font-bold")
// "p-4 text-black font-bold"
```
It can be imported or used as a static method on `ClazzX`.

## Accessing fields
Each ClazzX instance exposes a static `get()` method to access the fields and methods of the class.

# Examples

## React Link
```ts
import { Style, StyleProps } from "clazzx"

class LinkStyles extends ClazzX {
   base: "font-link no-underline transition duration-200"

   primary: "text-link hover:text-link-hover"
   secondary: "text-secondary hover:text-secondary-hover"
   active: "text-active hover:text-active-hover underline"

   default = this.primary
}

interface Link {
   children: ReactNode 
   props: StyleProps<LinkStyles> & HTMLAttributes<HTMLAnchorElement>
}

function Link({children, ...props}: Link){
   return <a {...props} className={LinkStyles.compose({...props})}>{children}</a>
}

function App(){
   const router = useRouter()
   return (
      <Link href="/about" secondary active={router.isCurrentPage}>
         My Link
      </Link>
   )
}
```

## With Globals
```ts
class GlobalStyles extends ClazzX {
   padding = {
      sm: "p-2",
      md: "p-4",
      lg: "p-6",
      dynamic: (i: number) => {
         `p-[${i*2}px]`
      }
   }
}

class Input extends GlobalStyles {
   sm = clx(this.padding.sm, "rounded-sm")
   md = clx(this.padding.md, "rounded-md")
   lg = clx(this.padding.lg, "rounded-lg")

   warning = "outline-red"
   compounds = [{
      state: ["sm", "warning"],
      classes: this.padding.dynamic(8)
   }]
}
```
