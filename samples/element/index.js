import { element, render, style } from '../../src/main.js'

const s1 = style`
	& { color:blue }
`

function myComponent2(props){
	return element`
		<b>${props.data.message}</b>
	`
}

let myComponent = 2
const App = element({
	components:{
		myComponent
	}
})`
	<div class="${s1}">
		<myComponent data="${{message:"hi!!!!"}}"/>
	</div>
`

render(App,document.getElementById("app"))

