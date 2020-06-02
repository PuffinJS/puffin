## 🐧 PuffinJS

### 🤔 About

PuffinJS is a JavaScript library for creating reusable components for web.

### 🔬 Status

Pretty stable but, be careful when using on production. (WIP)

What does it have?
* Reusable components
* Components styling
* State manager
* Events emitter
* Router
* Addons middlewares
* Language addon

### ⚽ Usage

Installing:
> npm install @mkenzo_8/puffin

Importing:
> import { element, style, state, render, routerBox, routerLink, lang } from "@mkenzo_8/puffin"

**Example projects are located under /samples.**

Example:
```javascript
import { element, style, render } from '@mkenzo_8/puffin'

const myStyles = style`
	& {
		color: rgb(100,100,100);
	}
`

const App = () => {
	return element`
		<div class="${myStyles}">
			<h1>Hello World</h1>
			<button :click="${clickMe}">Click me</button>
		</div>
	`
}

function clickMe(){
	alert("Hello World!")
}

render(App(),document.body)

```

### 📜 License

MIT License

Copyright (c) Marc Espín Sanz

[Full license](LICENSE.md)