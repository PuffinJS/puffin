import { element, render, style, lang, state, createElement } from '../../src/main.js'

const a = new state({
	
})

a.on('e', () => {
	test.nice +8
	console.log('1')
})

a.on('e', () => {
	console.log('2')
})

function onclick(){
	this.parentElement.children[1].update()
	a.emit('e')
}

const App = element`
	<div>
		<button :click="${onclick}">Randomize</button>
		<div>
			Random numbers:
			${()=> [0,0,0].map(()=>{
				return element`<p>${Math.random()}</p>`
			})}
		</div>
	</div>
`

render(App,document.getElementById("app"))


