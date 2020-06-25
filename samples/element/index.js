import { element, render, style, lang, state, createElement } from '../../src/main.js'

function onclick(){
	this.parentElement.children[1].update()
}

const App = element`
	<div>
		<button :click="${onclick}">Randomize</button>
		<div>
			Random numbers:
			${()=> [0,0,0].map(a=>{
				return element`<p>${Math.random()}</p>`
			})}
		</div>
	</div>
`

render(App,document.getElementById("app"))


