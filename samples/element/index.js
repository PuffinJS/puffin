import { element, render, style, lang, state, createElement } from '../../src/main.js'

const memory = new state({
	
})

memory.on('e', () => {
	console.log('1')
})

memory.on('e', () => {
	console.log('2')
})

function onclick(){
	this.parentElement.children[1].update()
	memory.emit('e')
}

function SupperButton(){
	return element`<button/>`
}

const App = element({
	components:{
		SupperButton
	}
})`
	<div>
		<SupperButton nice="no" test="${{hello: true}}" :click="${onclick}">Randomize</SupperButton>
		<div>
			Random numbers:
			${()=> [0,0,0].map(()=>{
				return element`<p>${Math.random()}</p>`
			})}
		</div>
	</div>
`

render(App,document.getElementById("app"))


