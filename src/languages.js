const { generateClass } = require("./utils")

function setClass(element){
	const selectedClass = generateClass()
	element.classList.add(selectedClass)
	return selectedClass
}

function lang(state){
	return {
		iterateElement(element){
			const selectedClass = setClass(element)
			appendText(state,element)
			state.changed(()=> {
				const elements = document.getElementsByClassName(selectedClass)
				for(let element of elements){
					appendText(state,element)
				}
			})
		}
	}
}

function appendText(state,element){
	const string = element.getAttribute('lang-string')
	if(string!= undefined && state.data[string] ){
		element.textContent = state.data[string]
	} 
}
module.exports  = lang