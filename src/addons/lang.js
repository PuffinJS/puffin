import { generateClass } from "../utils"

function setClass(element){
	const selectedClass = generateClass()
	element.classList.add(selectedClass)
	return selectedClass
}

function lang(state){
	return {
		iterateElement(element){
			appendText(state,element)
			state.changed(() => {
				appendText(state,element)
			})
		}
	}
}

lang.getTranslation = (string,state) => {
	return getValueIfProperty(string.split('.'), state.data.translations, 0) || getValueIfProperty(string.split('.'), state.data.fallbackTranslations, 0) || string
}

function getValueIfProperty(strings, value, i){
	if(  i < strings.length && value){
		return getValueIfProperty(strings, value[strings[i]], i + 1)
	}else{
		return value
	}
}

function appendText(state, element){
	let string = element.getAttribute('lang-string')
	const templateString = element.getAttribute('string') || `{{${string}}}`
	if( string && string != '' ){
		let stringComputed = getValueIfProperty(string.split('.'), state.data.translations, 0)
		if( stringComputed ) {
			element.textContent = templateString.replace(`{{${string}}}`, stringComputed)
		}else if( state.data.fallbackTranslations && getValueIfProperty(string.split('.'), state.data.fallbackTranslations, 0) ){
			element.textContent =  getValueIfProperty(string.split('.'), state.data.fallbackTranslations, 0) 
		}else{
			element.textContent = string
		}
	}else if(string){
		element.textContent = string
	}
}

module.exports  = lang