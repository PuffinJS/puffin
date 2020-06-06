import { element, render, style, lang, state } from '../../src/main.js'

const s1 = style`
	& { color:blue }
`

function myComponent(props){
	return element`
		<b :click="${()=>console.log("test")}">${props.data.message}</b>
	`
}

const myState = new state({})

function onclick(){
	myState.emit('action',element`<p>Hello World</p>`)
}

const Todo = () => {
	let things = []
	
	function add(){
		const { update } = this
		const { children } = this.parentElement
		things.splice(0,0,children[0].value)
		children[2].update()
	}
	
	return element`
		<div>
			<input/>
			<button :click="${add}">add</button>
			<div>
			${() => things.map(thing => element`<p>${thing}</p>`)}
			</div>
		</div>
	`
}

const App = element({
	components:{
		Todo
	}
})`
	<div>
		<button :click="${onclick}">Show promise</button>
		<div>
			${myState.on('action')} 
			${myState.on('action')} 
			${myState.on('action')} 
		</div>
		<Todo/>
	</div>
`

render(App,document.getElementById("app"))


