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

const App = element`
	<div>
		<button :click="${onclick}">Show promise</button>
		<div>
			${myState.on('action')} 
			${myState.on('action')} 
			${myState.on('action')} 
		</div>
	</div>
`

render(App,document.getElementById("app"))


