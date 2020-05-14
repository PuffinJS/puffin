import element from './element'

window.prouter = {
	links:[],
	boxes:[]
}

function renderBox(_box,_path){
	hideRoutes(_box)
	showRoute(_box,_path)	
}

function showRoute(_box,route,init = false){
	Object.keys(_box.children).map( n => {
		const routeNode = _box.children[n]
		const routeEndpoint = simulateLocation(routeNode.getAttribute("from"))
		const simulatedDefaultRouter = simulateLocation(_box.getAttribute("default"))
		const simulatedCurrentRoute = simulateLocation(route)
		if( simulatedCurrentRoute.match(routeEndpoint) ){
			routeNode.style.display = "block"
			const event = new CustomEvent('displayed', { });
			routeNode.dispatchEvent(event);
			activeLink(_box.getAttribute("group"),simulatedCurrentRoute)
			history.replaceState({}, "", route)
		}else if( simulatedCurrentRoute.match(routeEndpoint) && location.toString() === simulatedCurrentRoute){
			routeNode.style.display = "block"
			const event = new CustomEvent('displayed', { });
			routeNode.dispatchEvent(event);
			activeLink(_box.getAttribute("group"),simulatedDefaultRouter)
			history.replaceState({}, "",  _box.getAttribute("default"))
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

function activeLink(groupLink,routerBox){
	window.prouter.links.forEach( ({group, node}) => {
		node.classList.remove('active')
		const simulatedLinkRoute = simulateLocation(node.getAttribute("to"))
		if(routerBox.match(simulatedLinkRoute)){
			node.classList.add('active')
		}
	})
}

function addLink(group,node){
	window.prouter.links.push({
		group,
		node
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
		showRoute(this,endpoint, true)
	}
	function hidden(){
		hideRoutes(this)
	}
	return element`<div :hidden="${hidden}" mounted="${mounted}"></div>`
}

const simulateLocation = (route="") => {
	const { fulldomain } = getCurrentLocation()
	return `${fulldomain}${route}`.trim()
}

function getCurrentLocation(){
	const currentLocation = window.location.toString().split(/(\/)|(#)/g).filter(Boolean)
	const endpoints = currentLocation.slice(4)
	return {
		protocol: currentLocation[0],
		fulldomain:currentLocation.slice(-currentLocation.length,4).join(""),
		domain:currentLocation[2],
		endpoint:window.location.pathname,
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
	function mounted(){
		addLink(
			this.getAttribute("group"),
			this
		)
		const routeEndpoint = simulateLocation(this.getAttribute("to"))
		if( window.location.toString().match(routeEndpoint) ){
			this.classList.add("active")
		}
	}
	return element`<a mounted="${mounted}" :click="${click}"></a>`
}

module.exports =  {
	routerBox,
	routerLink
}