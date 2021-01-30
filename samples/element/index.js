import { element, render, style, lang, state, createElement } from '../../src/main.js'

const memory = new state({
	translations: {
		test: "Hello World"
	}
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

function SupperButton(props){
	return element`
	<button title="Minimize" >
		<svg xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="24" height="24">
			<rect x="7" y="11.5" width="10" height="0.2" />
		</svg>
	</button>`
}

const App = element({
	addons:[lang(memory)],
	components:{
		SupperButton
	}
})`
	<div>
		<SupperButton wow="aaa" nice="${"test"}" test="${{hello: true}}" :click="${onclick}"/>
		<p lang-string="test"/>
		<div>
			Random numbers:
			${()=> [0,0,0].map(()=>{
				return element`<p lang-string="test"/>`
			})}
		</div>
	</div>
`

render(App,document.getElementById("app"))


