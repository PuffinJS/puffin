import element from './element'

window.prouter = {
	links:[],
	boxes:[]
}

function renderBox(_box,_path){
	hideRoutes(_box)
	showRoute(_box,_path)	
}

function showRoute(_box,route){
	Object.keys(_box.children).map( n => {
		const routeNode = _box.children[n]
		const routeEndpoint = simulateLocation(routeNode.getAttribute("from"))
		const simulatedCurrentRoute = simulateLocation(route)
		if( simulatedCurrentRoute.match(routeEndpoint) ){
			routeNode.style.display = "block"
			const event = new CustomEvent('displayed', { });
			routeNode.dispatchEvent(event);
			history.replaceState({}, "", route)
		}
	})
}

function hideRoutes(_box){
	Object.keys(_box.children).map( n => {
		const routeNode = _box.children[n]
		routeNode.style.display = "none"
		const event = new CustomEvent('hidden', { });
		routeNode.dispatchEvent(event);
	})
}

function addBox(group,node,pages){
	window.prouter.boxes.push({
		group,
		node,
		pages
	})
}

function getBox(group){
	return window.prouter.boxes.find(box => box.group == group).node
}

function getBoxRoutes(node){
	return Object.keys(node.children).map( n => {
		const routeNode = node.children[n]
		return {
			node:routeNode,
			endpoint: routeNode.getAttribute("from")
		}
	})
}

function routerBox(){
	function mounted(){
		addBox(
			this.getAttribute("group"),
			this,
			getBoxRoutes(this)
		)
		this.render = (_path) => {
			renderBox(this,_path)
		}
		const { endpoint } = getCurrentLocation()
		hideRoutes(this)
		showRoute(this,endpoint)
	}
	function hidden(){
		hideRoutes(this)
	}
	return element`<div :hidden="${hidden}" mounted="${mounted}"></div>`
}

const simulateLocation = (route="") => {
	const { fulldomain } = getCurrentLocation()
	return `${fulldomain}${route}`
}

function getCurrentLocation(){
	const currentLocation = window.location.toString().split(/(\/)|(#)/g).filter(Boolean)
	const endpoints = currentLocation.slice(4)
	return {
		protocol: currentLocation[0],
		fulldomain:currentLocation.slice(-currentLocation.length,4).join(""),
		domain:currentLocation[2],
		endpoint:endpoints.join(""),
		endpoints
	}
}

function routerLink(){
	function click(){
		const linkEndpoint = this.getAttribute("to")
		const linkGroup = this.getAttribute("group")
		const routerBox = getBox(linkGroup)
		routerBox.render(linkEndpoint)
	}
	return element`<a :click="${click}"></a>`
}

module.exports =  {
	routerBox,
	routerLink
}