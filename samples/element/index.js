import { element, render, style } from '../../src/main.js'

const s1 = style`
	& { color:red }
`

function myComponent( childs ){
	let count = 1
	function click(){
		count++
		this.update()
	}
	return element`
		<div class="${s1}">
			<button number="idk:  ${()=>Math.random()}" :click="${click}">
				${()=>count}
			</button>
			<div>${childs}</div>
		</div>
	`
}

const App = element`
	<div>
		<h1>App</h1>
		<p>100 components: </p>
		${[...Array(5).keys()].map( n => {
			return myComponent(
				element`
					<p :click="${(e)=>console.log(e.target)}">${Math.random()}</p>
				`
			)
		})}
	</div>
`

render(App,document.body)
