function element(in_HTML){
	const computedArguments = [...arguments].slice(1,[...arguments].length)
	const { output ,binds } = parseBinds(in_HTML,computedArguments)
	return parseHTML(output,binds)
}

function generateClass() {
  return `pfn_${(Math.random() + Math.random()).toString().slice(12)}`;
}

function parseHTML(in_HTML,binds){
	const elements = in_HTML.match(/\<.*?\>|([^\>]+(?=\<))/gm).filter(Boolean).map(a=>{
		return purifyString(a);
	}).filter(Boolean)
	let tree = {
		_opened:true,
		_is:'puffin',
		children:[]
	}
	elements.map((element)=>{
		parseElement(tree,element,binds)
	})
	return tree
}

function parseElement(tree,element,binds){
	const _parts = element.split(" ")
	const _isElement = isElement(_parts[0])
	const _type = _isElement && getTag(_parts[0]) || "__text"
	const _value = !_isElement?element:null
	const _opened = isOpened(_parts[0])
	const _closed = isClosed(_parts) 
	const _props = getProps(element,binds,_isElement)
	const where =  getLastNodeOpened(tree)
	addComponents(_props,where)
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

const isClosed = parts => parts[parts.length-1] === '/>' || parts[0][parts[0].length-2] == "/"

const addComponents = (props,where) => {
	props.filter((prop)=>{
		if( prop.type == "comp" ){
			if( Array.isArray(prop.value) ){
				prop.value.map( child => {
					where.children.push(child.children[0])
				})
			}else{
				where.children.push(prop.value.children[0])
			}
			
		}
	})
}

const isCompLinker = (props) => {
	let isLinker = false
	props.filter((prop)=>{
		if( prop.type == "comp" ){
			isLinker = true
		}
	})
	return isLinker
}


const getBind = (str)=>{
	const result = str.match(/(\$BIND)\w+/gm)
	if ( !result ) return ""
	return result[0]
}

function searchBind(str,binds){
	const result = getBind(str)
	if( !result ) return
	const bind = result.split("D")
	if( !bind[1] ) return
	const bindNumber = eval(purifyString(bind[1]))
	return binds[bindNumber]
}
const getProps = ( element, binds, isElement ) => {
	const props = element.split(/([:]?\w+\=\"+[\s\w$]+")|(\<\w+)/gm).filter(Boolean)
	return props.map((p,index,total)=>{
		if(p[p.length-1] == ">" && total.length-1 == index) {
			p = p.slice(0,-1)
		}
		if(p[p.length-1] == "/" && total.length-1 == index) {
			p = p.slice(0,-1)
		}
		if( p.includes("=") ){
			const prop = p.split("=")
			const propKey = prop[0]
			const propValue = searchBind(prop[1],binds) || prop[1]
			let identifier = getBind(prop[1])
			let attributeValue = prop[1]
			if( isFunctionEvent(propKey)){
				var type = 'puffinEvent'
			}else if( typeof propValue == 'function' && propKey.includes(":") ){
				var type = 'event'
			}else if( typeof propValue == 'object' ){
				var type = 'object'
			}else if( typeof propValue == 'function' ){
				var type = 'attributeFunction'
			}else{
				var type = 'attribute'
			}
			return {
				key:propKey,
				type,
				identifier,
				attributeValue,
				value:propValue
			}
		}else if( p.includes('$BIND') ){
			const propKey = getBind(p)
			const propValue = searchBind(p,binds)
			if( isComponent(propValue) ){
				var type = 'comp'
			}else if( typeof propValue == 'string' || typeof propValue == 'number' || typeof propValue == 'boolean'  ){
				var type = 'text'
			}else if(  typeof propValue == 'function'){
				var type = 'textFunction'
			}
			return {
				key:propKey,
				type,
				value:propValue
			}
		}
		
	}).filter(Boolean)
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
		output = output.replace('to__BIND',`$BIND${i} `)
		computedBinds.push(methods[i])
	}
	
	return {
		output,
		binds:computedBinds
	}
}




module.exports = element