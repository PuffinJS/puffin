const puffin = require("./puffin")
const puffinState = require("./state")

const state = puffinState({
	active:null
})

function parseURL(url){
	const parsedURL = url.toString().split(/(\/)|(#)/g).filter(x => Boolean(x))
	let paths = []
	parsedURL.map(function(path,index){
		if(index > 3 && path != "#"){
			paths.push({
				name:path
			})
		}
	})
	const returnURL = {
		protocol:parsedURL[0],
		domain:parsedURL[3],
		paths:paths
	}
	return returnURL
}

function matchPath(objectURL,arrayPaths,additional){
	let message = {
		status:false
	}
	arrayPaths.map(function(pathComponent){
		const splittedPath = pathComponent.path == "/" ? ["/"] : pathComponent.path.split('/').filter(Boolean)
		objectURL.paths.map(function(currentPath,index){
			if(( splittedPath[index-1] == currentPath.name && splittedPath[index-1] !== "/" && splittedPath[index] == undefined) || (splittedPath[index] === "/" && objectURL.paths.length == splittedPath.length) ){
				if(pathComponent.paths != undefined && objectURL.paths[objectURL.paths.length-1].name != currentPath.name){
					objectURL.paths.splice(0,3)
					const paths =  {paths:[{name:"/"},...objectURL.paths]}
					message = matchPath(paths,pathComponent.paths,{
						lost:pathComponent.lost == undefined?additional.lost:pathComponent.lost
					})
				}else{
					message = {
						status : true,
						component : pathComponent.component,
						title:pathComponent.title == undefined? pathComponent.path:pathComponent.title,
						path:pathComponent.path
					}
				}

			}
		})
	})
	if(message.status == false){
		const fallbackComp = (()=>{
			const endpoint = (()=>{
				return objectURL.paths.map(ph=>{
					return ph.name
				}).join("")
			})()
			const dynamicComp = {
				...additional.dynamic({
					endpoint
				}),
				path:endpoint
			}
			if( dynamicComp ){
				return dynamicComp
			}else{
				return {
					path:'lost',
					...additional.lost
				}
			}
		})()
		message = {
			status : true,
			component :fallbackComp.component ,
			title:fallbackComp.title == undefined? '':fallbackComp.title,
			path:fallbackComp.path
		}
	}
	return message;
}

function renderBox(configuration,boxNode,additionalConfig,data){
	const currentURL = parseURL(window.location)
	const result = matchPath(currentURL,configuration,additionalConfig)
	if(result.status){
		state.data.active = result.path
		document.title = result.title
		const component = typeof result.component == 'function'?result.component(data):result.component 
		puffin.render(component,boxNode,{
			removeContent:true
		})
	}
}

function goToPath(configuration,boxNode,additionalConfig,path,data){
	history.replaceState({}, "", path)
	renderBox(configuration,boxNode,additionalConfig,data)
}

function puffinRouter(configuration,additionalConfig){
	const id = Math.random()

	const data = {
		box:puffin.element(`
			<div id="${id}"/>
		`,{
			events:{
				fabricated(){
					renderBox(configuration,this,additionalConfig)  
				},
				mounted(){
					state.on('goTo',({endpoint})=>{
						goToPath(configuration,this,additionalConfig,endpoint,data)
					})
				}
			}
		}),
		link: puffin.element(`
			<a click="$click">{{text}}</a>
		`,{
			methods:{
				click(){
					state.emit('goTo',{endpoint:this.getAttribute('path')})
				}
			},
			props:["text","path"],
			events:{
				mounted(target){
					const linkEndpoint = this.getAttribute("path")
					state.keyChanged('active',(()=>{
						target.classList.remove('active')
						if( checkEndpoint( state.data.active,linkEndpoint) ){
							target.classList.toggle('active')
						}
					}))
					if( checkEndpoint(state.data.active,linkEndpoint) || window.location.pathname == linkEndpoint ) target.classList.add('active')
				}
			}
		}),
		goTo(path){
			state.emit('goTo',{endpoint:path})
		}
	}
	window.addEventListener("DOMContentLoaded",function(){
		state.emit('goTo',{endpoint:null})      
	})
	
	return data 
}

function checkEndpoint( complete, part){
	if ( !complete ) return false
	return ( (complete.startsWith(part) && part != '/' ) || ( part == '/' && part ==  complete ) )

}

module.exports = puffinRouter