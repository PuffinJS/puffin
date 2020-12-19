import { generateClass, throwError } from '../utils'

function element(input){
	if( Array.isArray(input) ){
		return continueParsing(input,arguments)
	}else{
		return function(text){
			return continueParsing(text,arguments,input)
		}
	}
	function continueParsing(text,args,config){
		const computedArguments = [...args].slice(1,[...args].length)
		const { output ,binds } = parseBinds(text,computedArguments)
		return parseHTML(output,binds,config)
	}
}

const isFullSpaces = str => {
	if( str ) {
		const matches = str.match(/\s/gm)
		return matches && matches.length === str.length
	}
	return true
}

const isFullTabs = str => {
	const matches = str.match(/	/gm)
	return matches && matches.length === str.length
}

const parseArrow = input => input.match(/\<.*?\>|([^\>]+(?=\<))/gm)

function parseHTML(in_HTML, binds, config = {}){
	let elements = parseArrow(in_HTML)
	if( elements ) {
		elements = elements.filter(a=>Boolean(a) && !isFullTabs(a) && !isFullSpaces(a) ).map(a=>{
			return purifyString(a);
		}).filter(Boolean)
	}else{
		elements = [in_HTML]
	}
	const tree = {
		_opened: true,
		_is: 'puffin',
		children:[]
	}
	if( config.addons ) tree.addons = config.addons
	elements.map((element)=>{
		parseElement(tree,element,binds,config)
	})
	return tree
}

function parseElement(tree,element,binds,config){
	const _parts = element.split(/( )|(\/>)/gm).filter(Boolean)
	const _isElement = isElement(_parts[0])
	const _type = _isElement && getTag(_parts[0]) || "__text"
	const _value = !_isElement?element:null
	const _opened = isOpened(_parts[0])
	const _closed = isClosed(_parts) 
	const _props = getProps(element,binds,_isElement)
	const where =  getLastNodeOpened(tree)
	addComponents(_props, where )
	if(  isExternalComponent(_type,config) ) {
		if( _opened ){
			addExternalComponent(_type, config, where,_closed ,_props) 
			return
		}
	}
	if( isCompLinker(_props)) return
	if ( _opened )  {
		const currentElement = {
			_type,
			_isElement,
			_opened:!_closed,
			_props,
			children:[]
		}
		if( !_isElement ) {
			currentElement._value = _value
		}
		where.children.push(currentElement)
	}else{
		where._opened = false
	}
}

const isExternalComponent = (tag, config) => {
	return config && config.components && config.components[tag]
}

function mixClasses(_props1, _props2){
	_props1.forEach(prop1 => {
		_props2.forEach((prop2, index) => {
			if( prop2.key === prop1.key && prop2.type == "attributeText" && prop1.type == "attributeText" ){
				const newValue = prop2.attributeValue.replace(prop2.propIdentifier,prop2.value)
				prop1.attributeValue = `${prop1.attributeValue} ${newValue}`
				_props2.splice(index,1)
			}
		})
	})
	return _props2
}

function getAttributeObjectProps(arrayProps){
	let objectProps = {}
	arrayProps.map(prop => {
		objectProps[prop.key] = prop.value
	})
	return Object.assign({}, objectProps)
}

const addExternalComponent = (tag, config, where, _closed, _props) => {
	if( config && config.components && config.components[tag]){
		if( typeof config.components[tag] !== 'function' ){
			return throwError(`${tag}() is not a function, so it cannot return an element.`)
		}
		const argumentProps = getAttributeObjectProps(_props)
		const componentExported = config.components[tag](argumentProps)
		if( Array.isArray(componentExported) ){
			componentExported.forEach(comp => {
				comp.children.forEach( ( child, index) => {
					where.children.push(child)
				})
			})
		}else{
			componentExported.children.forEach( (child,index) => {
				if( index == 0 ){
					if( !_closed ) child._opened = true
					_props = mixClasses(child._props,_props)
					child._props = [...child._props,_props].flat()
				}
				where.children.push(child)
			})
		
		}
	} 
}

const executeEvents = events => events.forEach( e => e() )

const purifyString = str => str.replace(/(\t|\r\n|\n|\r|\\)/gm, "") 

const removeSpaces = str => str.replace(" ","")

const removeCommas = str => str.replace(/"/gm,"")

const isElement = tag => tag.search(/(<)|(>)/gm) == 0

const getTag = tag => tag.replace(/([<>/])/gm,"")

const isComponent = comp =>  Array.isArray(comp) || comp._is === 'puffin'

const isFunctionEvent = name => {
	if( name == 'mounted'){
		return true
	}
}

const isPromise = func => {
	 return !!func && typeof func.then === 'function';
}

const isOpened = _type => _type[1] !== "/" || _type[_type.length-2] == "/"

const isClosed = parts => parts[parts.length-1] === '/>' || parts[0][parts[0].length-2] == "/" || parts[0][1] == "/"

const addComponents = (props,where) => {
	props.filter((prop) => {
		if( prop.type == 'comp' ){
			if( Array.isArray(prop.value) ){
				prop.value.map( comp => {
					comp.children.forEach( child => where.children.push(child))
				})
			}else{
				prop.value.children.forEach( child => where.children.push(child))
			}
		}
	})
}

const isCompLinker = props => {
	let isLinker = false
	props.filter((prop) => {
		if( prop.type == "comp" ){
			isLinker = true
		}
	})
	return isLinker
}


const getBind = str => {
	const result =str.match(/(\$BIND)[0-9]+\$/gm)
	if ( !result ) return ''
	return result[0]
}

function searchBind(str,binds){
	const result = getBind(str)
	if( !result ) return ''
	const bind = result.match(/[0-9]+/gm)
	if( !bind ) return ''
	const bindNumber = eval(purifyString(bind[0]))
	return binds[bindNumber]
}

const getAttributeProp = (bind, propKey, propValue, binds) =>{
	const propInternalValue = searchBind(bind,binds)
	const valueIdentifier = getBind(bind)
	const attributeValue = removeCommas(propValue) 
	const propIdentifier = bind
	let propType
	
	if( isFunctionEvent(propKey)){
		propType = 'puffinEvent';
	}else if( typeof propInternalValue == 'function' && propKey.includes(':') ){
		propType = 'event';
	}else if( typeof propInternalValue == 'object' ){
		propType = 'attributeObject';
	}else if( typeof propInternalValue == 'function' ){
		propType = 'attributeFunction';
	}else{
		propType = 'attributeText';
	}
	return {
		key: propKey,
		type: propType,
		valueIdentifier,
		attributeValue,
		propIdentifier,
		value: propInternalValue
	}
}

function getTextProp(prop, binds){
	const propKey = getBind(prop)
	const propValue = searchBind(prop, binds) 
	if( isComponent(propValue) ){
		var type = 'comp';
	}else if( isPromise(propValue) ){
		var type = 'textPromise';
	}else if( typeof propValue == 'string' || typeof propValue == 'number' || typeof propValue == 'boolean'  ){
		var type = 'text';
	}else if( typeof propValue == 'function'){
		var type = 'textFunction';
	}
	return {
		key: propKey,
		type,
		value: propValue
	}
}

const getProps = (element, binds, isElement) => {
	const props = element.split(/([:]?[\w-]+\=\"+[\s\w.,()\-\|&{}$%;:]+")|(\<\w+)/gm).map((token, index, total) => {
		if(Boolean(token) && !isFullSpaces(token)){
			if(token[token.length-1] == ">" && token.length-1 == index) {
				token = token.slice(0,-1)
			}
			if(token[token.length-1] == "/" && total.length-1 == index) {
				token = token.slice(0,-1)
			}
			const bindsFound = token.match(/(\$BIND)[0-9]+\$/gm) || []
			if( token.includes("=") ){
				const prop = token.split("=")
				const propKey = prop[0].trim()
				const propValue = prop[1]
				if ( bindsFound.length > 0 ){
					return bindsFound.map( bind => {
						return getAttributeProp(bind, propKey, propValue, binds)
					})
				}else{
					return getAttributeProp(propKey, propKey, propValue, binds)
				}
			}else if( token.includes('$BIND') ){
				if ( bindsFound.length > 0 ){
					return bindsFound.map( bind => {
						return getTextProp(bind,binds)
					})
				}else{
					const propKey = getBind(token)
					return getTextProp(propKey,binds)
				}
			} 
		}
	}).flat().filter(Boolean)
	return props
}

function getLastNodeOpened(tree){
	let lastChild = tree;
	tree.children.filter((child) => {
		if( child._opened === true && child._isElement === true ){
			if( child.children.length > 0){
				lastChild = getLastNodeOpened(child)
			}else{
				return lastChild = child
			}
		}
	})
	return lastChild
}

const parseBinds = (input, methods) => {
	let output = input.join("to__BIND")
	const bindsMatched = output.match(/to__BIND/g)
	const bindsLength = bindsMatched && bindsMatched.length
	const computedBinds = []
	for( let i = 0; i<bindsLength;i++){
		output = output.replace('to__BIND',`$BIND${i}$`)
		computedBinds.push(methods[i])
	}
	return {
		output,
		binds: computedBinds
	}
}

export default element