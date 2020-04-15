import { element, render, style } from '../../src/main.js'

const s1 = style`
	& { color:red }
`

function myComponent( childs = "" ){
	let count = 1
	function click(){
		count++
		this.update()
	}
	return element`
		<div class="${()=>"k"} ${()=>s1} ">
			<button number="idk:  ${()=>Math.random()}" :click="${click}">
				${()=>count}
			</button>
			<div>${childs}</div>
		</div>
		<p>hi</p>
	`
}


function line(a){
	function mounted(){
		console.log(Math.random())
	}
	return element`
		<div mounted="${mounted}">
			<b>Test</b>
		</div>
	`
}

const t1= performance.now()

const App = element`
	<div>
		${[...Array(10).keys()].map( n => {
			return element({
				components:{
					line
				}
			})`
			<line>
				<p>Message</p>
			</line>`
		})}
	</div>
`

const t2= performance.now()

console.log(t2-t1)

render(App,document.getElementById("app"))
