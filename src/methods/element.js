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

function generateClass() {
  return `pfn_${(Math.random() + Math.random()).toString().slice(12)}`;
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

function parseHTML(in_HTML,binds,config){
	let elements = parseArrow(in_HTML)
	if( elements ) {
		elements = elements.filter(a=>Boolean(a) && !isFullTabs(a) && !isFullSpaces(a) ).map(a=>{
			return purifyString(a);
		}).filter(Boolean)
	}else{
		elements = [in_HTML]
	}
	let tree = {
		_opened:true,
		_is:'puffin',
		children:[]
	}
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

function mixClasses(_props1,_props2){
	_props1.forEach( prop1 => {
		_props2.forEach( (prop2,index) => {
			if( prop2.key === prop1.key ){
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
	arrayProps.map( prop =>{
		objectProps[prop.key] = prop.value
	})
	return Object.assign({},objectProps)
}

const addExternalComponent = (tag, config, where,_closed,_props) => {
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
				if( index == 0 && !_closed){
					child._opened = true
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

const isOpened = _type => _type[1] !== "/" || _type[_type.length-2] == "/"

const isClosed = parts => parts[parts.length-1] === '/>' || parts[0][parts[0].length-2] == "/" || parts[0][1] == "/"

const addComponents = (props,where) => {
	props.filter((prop)=>{
		if( prop.type == "comp" ){
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
	props.filter((prop)=>{
		if( prop.type == "comp" ){
			isLinker = true
		}
	})
	return isLinker
}


const getBind = str =>{
	const result =str.match(/(\$BIND)\w+/gm)
	if ( !result ) return ""
	return result[0]
}

function searchBind(str,binds){
	const result = getBind(str)
	if( !result ) return ""
	const bind = result.split("D")
	if( !bind[1] ) return ""
	const bindNumber = eval(purifyString(bind[1]))
	return binds[bindNumber]
}


const getAttributeProp = (bind,prop,propKey,binds) =>{
	let propValue = searchBind(bind,binds)
	let valueIdentifier = getBind(bind)
	let attributeValue = removeCommas(prop[1]) 
	let propIdentifier = bind
	if( isFunctionEvent(propKey)){
		var type = 'puffinEvent';
	}else if( typeof propValue == 'function' && propKey.includes(":") ){
		var type = 'event';
	}else if( typeof propValue == 'object' ){
		var type = 'attributeObject';
	}else if( typeof propValue == 'function' ){
		var type = 'attributeFunction';
	}else{
		var type = 'attributeText';
	}
	return {
		key:propKey,
		type,
		valueIdentifier,
		attributeValue,
		propIdentifier,
		value:propValue
	}
}

const getProps = ( element, binds, isElement ) => {
	const props = element.split(/([:]?[\w-]+\=\"+[\s\w.,()$%;:]+")|(\<\w+)/gm).filter(a=>Boolean(a) && !isFullSpaces(a))
	return props.map((p,index,total)=>{
		if(p[p.length-1] == ">" && total.length-1 == index) {
			p = p.slice(0,-1)
		}
		if(p[p.length-1] == "/" && total.length-1 == index) {
			p = p.slice(0,-1)
		}
		if( p.includes("=") ){
			const prop = p.split("=")
			const propKey = prop[0].trim()
			if ( p.match(/(\$BIND)\w+/gm) ){
				return p.match(/(\$BIND)\w+/gm).map( bind => {
					return getAttributeProp(bind,prop,propKey,binds)
				})
			}else{
				return getAttributeProp(propKey,prop,propKey,binds)
			}
		}else if( p.includes('$BIND') ){
			const propKey = getBind(p)
			const propValue = searchBind(p,binds) 
			if( isComponent(propValue) ){
				var type = 'comp';
			}else if( typeof propValue == 'string' || typeof propValue == 'number' || typeof propValue == 'boolean'  ){
				var type = 'text';
			}else if(  typeof propValue == 'function'){
				var type = 'textFunction';
			}
			return {
				key:propKey,
				type,
				value:propValue
			}
		}
		
	}).flat().filter(Boolean)
}

function getLastNodeOpened(tree){
	let ret = tree;
	tree.children.filter((o)=>{
		if( o._opened === true && o._isElement === true ){
			if( o.children.length > 0){
				ret = getLastNodeOpened(o)
			}else{
				return ret = o
			}
		}
	})
	return ret
}

const parseBinds = ( input, methods ) => {
	let output = input.join("to__BIND")
	const bindsMatched = output.match(/to__BIND/g)
	const bindsLength = bindsMatched && bindsMatched.length
	const computedBinds = []
	for( let i = 0; i<bindsLength;i++){
		output = output.replace('to__BIND',`$BIND${i}`)
		computedBinds.push(methods[i])
	}
	return {
		output,
		binds:computedBinds
	}
}

function throwError(msg){
	console.error(`Puffin:: ${msg}`)
}

module.exports = element