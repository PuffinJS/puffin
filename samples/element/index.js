import { element, render, style } from '../../src/main.js'

const s1 = style`
	& { color:blue }
`

function myComponent(props){
	return element`
		<b :click="${()=>console.log("test")}">${props.data.message}</b>
	`
}

const App = element({
	components:{
		myComponent
	}
})`
	<div class="${s1}"  ok="${()=>Math.random()}" :click=${(e)=>e.target.update()}>
		<myComponent data="${{message:"hi!!!!"}}" lol="testdata" a="test${()=>"-wow-"}data"></myComponent/>
		<myComponent data="${{message:"hi!!!!"}}" a="HERE"/>
		<p>hi</p>
	</div>
`

render(App,document.getElementById("app"))

