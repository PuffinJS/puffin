const { element, render, routerBox, routerLink, router } = require("../../src/main.js");

function page1(){
	return element`
	<div> 
		<p>page 1</p>
	</div>`
}

function page2(){
	return element({
		components:{
			routerLink
		}
	})`
	<div>
		<br/>
		<routerLink group="page2" to="/page2/1">go first</routerLink>
		<routerLink group="page2" to="/page2/2">go second</routerLink>
	</div>`
}

const App =  element({
		components:{
			page1,
			page2,
			routerBox,
			routerLink
		}
	})`
	<div>
		<routerLink group="home" to="/home">Home</routerLink>
		<routerLink group="home" to="/page1">Page 1</routerLink>
		<routerLink group="home" to="/page2">Page 2</routerLink>
		<routerBox group="home" default="/home">
			<div from="/home">
				<p>This is home</p>
			</div>
			<page1 from="/page1"></page1>
			<page2 from="/page2">
				<b>Página 2</b>
				<routerBox group="page2" default="/page2/2">
					<div from="/page2/1">
						<p>First page</p>
					</div>
					<div from="/page2/2">
						<p>Second page</p>
					</div>
				</routerBox>
			</page2>
		</routerBox>
	</div>`

render(App,document.getElementById("app"))