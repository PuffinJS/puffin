function render( currentElement, parent ){
	const comp = createComponent( currentElement.children[0], null,[],[] )
	parent.appendChild(comp)
	executeEvents(comp.events)
}

const executeEvents = events => events.forEach( e => e() )

const createElement = type => {
	switch (type) {
		case "g":
		case "defs":
		case "stop":
		case "linearGradient":
		case "feColorMatrix":
		case "feBlend":
		case "filter":
		case "path":
		case "group":
		case "polyline":
		case "line":
		case "rect":
		case "circle":
		case "svg":
			return document.createElementNS("http://www.w3.org/2000/svg", type);
		default:
			return document.createElement(type)
	}
}

function createComponent( currentElement , componentNode, binds, puffinEvents){
	const currentNode = createElement(currentElement._type)
	if( currentElement._isElement ){
		if( !componentNode ){
			componentNode = currentNode	
		}else{
			componentNode.appendChild( currentNode )
		}
		createUpdateFunction(currentNode)
		appendProps(currentNode,currentElement,puffinEvents)
		currentNode.updates.push(()=>{
			appendProps(currentNode,currentElement,[],true)
		})
		currentNode.e=currentElement
		
	}else if( !currentElement._isElement 
			 && currentElement._type === '__text' 
	){
		appendProps(componentNode,currentElement,puffinEvents)
		componentNode.updates.push(()=>{
			appendProps(currentNode,currentElement,[],true)
			componentNode.innerText = currentElement._value
		})
		componentNode.innerText += currentElement._value
	}
	currentElement.children.map(child => createComponent( child, currentNode, binds, puffinEvents ))
	componentNode.events = puffinEvents
	return componentNode
}


const createUpdateFunction = node => {
	if( !node.updates ){
		node.updates = []
	}
	if( !node.update ){
		node.update = ()=>{
			node.updates.map(a=>a())
		}
	}
}


const appendProps = ( node, currentElement, puffinEvents, updating = false) =>{
	//Comp props are added on construction
	//textValue is only for __text elements
	const props = currentElement._props
	props.map((prop)=>{
		let textValue = currentElement._value
		switch(prop.type){
			case 'puffinEvent':
				if( prop.key == 'mounted' ) {
					puffinEvents.push( prop.value.bind(node) )
				}
				break;
			case 'event':
				if( !updating ) node.addEventListener( prop.key.replace(':',''), (e)=> prop.value.bind(node)(e) )
				break;
			case 'attributeText':
				prop.key = removeSpaces(prop.key)
				prop.value = removeCommas(`${prop.value}`)
				node.setAttribute( prop.key, prop.attributeValue.replace(prop.valueIdentifier,prop.value))
				break;
			case 'attributeObject':
				if( !node.props ) node.props = {}
				node.props[prop.key] = prop.value
				break;
			case 'attributeFunction':
				var newValue = prop.value()
				prop.key = removeSpaces(prop.key)
				if( !node.getAttribute(prop.key) ){
					node.setAttribute( prop.key, removeCommas(prop.attributeValue.replace(prop.propIdentifier,newValue)))
				}else{
					node.setAttribute( prop.key, removeCommas(node.getAttribute(prop.key).replace(prop.propIdentifier,newValue)))
				}
				prop.identifier = newValue
				break;
			case 'textFunction':
				var newValue = prop.value()
				currentElement._value = textValue.replace( prop.key, newValue )
				prop.key = newValue
				break;
			case 'text':
				currentElement._value = textValue.replace( prop.key, prop.value )
				break;
		}
	})
}
const removeSpaces = str => str.replace(" ","")

const removeCommas = str => str.replace(/"/gm,"")
module.exports = render