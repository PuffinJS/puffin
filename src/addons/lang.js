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
			state.changed(()=> {
				appendText(state,element)
			})
		}
	}
}

function appendText(state,element){
	const string = element.getAttribute('lang-string')
	const templateString = element.getAttribute('string') || `{{${string}}}`
	if( string && state.data[string] && state.data[string] != "" ){
		element.textContent = templateString.replace(`{{${string}}}`,state.data[string])
	}else if(string){
		element.textContent = string
	}
}

module.exports  = lang