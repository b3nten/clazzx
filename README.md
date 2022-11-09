# Introduction

Classe is a small (< 1kb gzipped) typesafe utility library for composing HTML classes. Unlike Vanilla Extract, Stitches, or CVA (all fantastic options) Classe takes a different approach, using *state* rather than *variants* to compose styles.

The classic approach is to create a series of variants that can be selected: 
```ts 
className={myButton({size: "small", intent="primary"})}
// AND
<Button size="small" intent="primary" />
```
In comparison, Classe models combinations of styles based on state.
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
intent=isLoading ? "loading" 
: isError ? "error" 
: "primary"
})}
// AND
<Button intent={isLoading ? "loading" : isError ? "error" : "primary"}>
```
# Acknowledgements

# Installation
```ts 
// NPM
npm i '@b_e_n_t_e_n/classe'
// Yarn
yarn add '@b_e_n_t_e_n/classe'
// Deno
import {Style, clx} from "https://deno.land/x/classe/mod.ts
```
# Getting Started

```ts
import { Style } from '@b_e_n_t_e_n/classe'

const MyCustomStyle exends Style {
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
	return <input className={input.classes({
		md: true,
		secondary: true
	})}/>
}
```

# API
