import { element, render, style, lang, state } from '../../src/main.js'

const languageProvider = new state({
	translations:{
		goodMorning:'Bon dia',
		test:{
			something:{
				good: true
			}
		}
	}
})

const s1 = style`
	& { color:blue }
`

function myComponent(props){
	return element`
		<b :click="${()=>console.log("test")}">${props.data.message}</b>
	`
}


const a = new state({})

function onclick(){
	a.emit('action',element`<p>Hello World</p>`)
}

const App = element`
	<div>
		<button :click="${onclick}">Show promise</button>
		<div>
			${a.on('action')} 
			${a.on('action')} 
			${a.on('action')} 
		</div>
	</div>
`

render(App,document.getElementById("app"))


