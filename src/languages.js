


function lang(state){
    return {
        iterateElement(element){
            element.setAttribute("TEST000","TEST999")
            appendText(state,element)
            state.changed(()=> appendText(state,element))
        }
    }
}

function appendText(state,element){
    const string = element.getAttribute('lang-string')
    if(string!= undefined){
        element.textContent  = state.data[string]
    } 
}
module.exports  = lang