![clazzx](/.github/clazzx.png)

# Introduction

ClazzX is a small (< 1kb gzipped) typesafe utility library for composing HTML classes. Unlike Vanilla Extract, Stitches, or CVA (all fantastic options) ClazzX takes a different approach, using *state* rather than *variants* to compose styles.

The classic approach is to create a series of variants that can be selected: 
```ts 
className={myButton({size: "small", intent="primary"})}
// AND
<Button size="small" intent="primary" />
```
In comparison, ClazzX models combinations of styles based on state.
```ts
className={myButton.classes({small: true, primary: true})}
// AND
<Button small primary />
```
This simplifies the logic of tying the styling of a component to complex state. Instead of a series of nested ternary operators, simple logical operators can be used to clearly define the appropriate styles.

```ts
className={myButton.classes({ 
	primary: true,
	loading: isLoading,
	error: isError 
})}
//AND
<Button primary loading={isLoading} error={isError}>

// Versus

className={myButton({
intent: isLoading ? "loading" 
: isError ? "error" 
: "primary"
})}
// AND
<Button intent={isLoading ? "loading" : isError ? "error" : "primary"}>
```

# Installation
```ts 
// Deno
import {Style, clx} from "https://deno.land/x/clazzx/mod.ts"
// NPM
npm i 'clazzx'
// Yarn
yarn add 'clazzx'
```
# Getting Started

## A basic component

```ts
import { Style } from 'clazzx'

const MyCustomStyle extends Style {
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

const input = new MyCustomStyle()

function MyCustomComponent(){
	return <input className={input.classes({ md: true, secondary: true })}/>
}
```
## Default Classes
You can set default classes that are applied if nothing is passed th the classes method.
```ts
default = [this.md, this.secondary, "hover:scale-105"]
```
## Compounds
If you want to conditionally apply styles when two or more states are true, you can create compound states.
```ts
compounds = [
	{
		state: ["primary", "large"],
		classes: "shadow-md" // will only be applied if both states are true
	}
]
```
## Constructor options
The constructor takes in an options object with the following properties:

* `before: string | string[]`: Classes to be applied before the conditional classes.
* `after: string | string[]`: Classes to be applied after the conditional classes.

## Ordering
Classes are applied in the order of the states.
```ts
className={btn.classes({rounded: true, square: true})}
// className="border-md border-none"
<Button primary secondary small medium>
// className="bg-primary bg-secondary text-sm text-md"
```
The order of classes works like this:
1. Base
2. Constructor `before`
3. ...order based on state `||` default classes
4. Compounds
5. Constructor `after`

## StyleProps
StyleProps is an exported type that gives you access to the parameters of the style class. You can use this to strongly type components.
```ts
function MyButton({...props}: StyleProps<MyStyleClass>){}
```

# Examples

## Basic
```ts
import {Style, StyleProps} from "clazzx"

class LinkStyles extends Style {
	base: "font-link no-underline transition duration-200"

	primary: "text-link hover:text-link-hover"
	secondary: "text-secondary hover:text-secondary-hover"
	active: "text-active hover:text-active-hover underline"

	default = this.primary
}
const link = new MyCustomLink()

interface Link {
	children: ReactNode 
	props: StyleProps<MyCustomLink> & HTMLAttributes<HTMLAnchorElement>
}

function Link({children, ...props}: Link){
	return <a {...props} className={link.classes({...props})}>{children}</a>
}

function App(){
	const router = useRouter()
	// ...
	return (
		// ...
		<Link href="/about" secondary active={router.isCurrentPage}>
			My Link
		</Link>
		// ...
	)
}
```
... more coming soon


