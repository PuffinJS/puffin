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
			<svg width="12" height="13" viewBox="0 0 12 13" fill="red" xmlns="http://www.w3.org/2000/svg">
				<path d="M12 6.5L0.75 12.9952V0.00480938L12 6.5Z"/>
			</svg>
		</div>
		<p>hi</p>
	`
}


function line(a){
	function mounted(){
		console.log(this.props.data)
	}
	return element`
		<b mounted="${mounted}" data="${{msg:Math.random()}}"/>
	`
}

const t1= performance.now()

const App = element`
	<div>
		${[...Array(10).keys()].map( n => {
			return element({
				components:{
					myComponent,
					line
				}
			})`
			<myComponent>
				<line>Message</line>
			</myComponent>`
		})}
	</div>
`

const t2= performance.now()

console.log(t2-t1)

render(App,document.getElementById("app"))
