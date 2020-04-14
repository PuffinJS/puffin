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

function App(){
	return element({
		components:{
			page1,
			page2,
			routerBox,
			routerLink
		}
	})`
	<div>
		<p>Home</p>
		<routerLink group="home" to="/page1">Page 1</routerLink>
		<routerLink group="home" to="/page2">Page 2</routerLink>
		<routerBox group="home" default="/page1">
			<page1 from="/page1"></page1>
			<page2 from="/page2">
				<b>Página 2</b>
				<routerBox group="page2" default="/page2/1">
					<div from="/page2/1">
						First page
					</div>
					<div from="/page2/2">
						Second page
					</div>
				</routerBox>
			</page2>
		</routerBox>
	</div>`
}

render(App(),document.getElementById("app"))