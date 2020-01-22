const puffin = require("./puffin")

const {generateClass,throwError,throwWarn} = require("./utils")

function replaceMatchs(text,state){
    let css = text;
    if(state != null){
        Object.keys(state.data).map(function(prop){
            const regex = new RegExp(`{{${prop}}}`,'g')
            css = css.replace(regex,state.data[prop])
        })
    }else{
        if(css.match(/({{)/g)){
            throwWarn('There is no state passed into style: '+text)
        }
    }
    return css
}

function applyCSS(css,selector){
    const style = document.createElement("style");
    style.type = "text/css";
    style.rel = "stylesheet";
    document.head.appendChild(style);
    css.map(function(sy){
        if(sy != ""){
            if(sy.match(/&/g)){
                var rule = sy.replace(/&/g,`.${selector}`)
                rule += " } "
            }else if(sy.match(/(body)||(html)/g)){
                var rule = sy;
            }else{
                var rule = `.${selector} ${sy} }`
            }
            style.sheet.insertRule(rule)
        }
    })
}

function getCSS(text,state){
   return replaceMatchs(text,state).split('}').map((a)=>a.trim())
}

function main(text,values,tagName){
    let state = null;
    if(values[0] != undefined){
        state = values[0].info == 'state'?values[0]:null
        text = text[1]
    }else{
        text = text[0]
    }
    const css = getCSS(text,state)
    const classSelected = generateClass()
    if(tagName!="css"){
        const element = puffin.element(`
            <${tagName} class="${classSelected}"></${tagName}>
        `,{
            events:{
                mounted(){
                    if(state != null){
                        state.changed(function(){
                            applyCSS(getCSS(text,state),classSelected)
                        })
                    }
                    applyCSS(css,classSelected)
                }
            }
        })  
        return element
    }else{
        if(state != null){
            state.changed(function(){
                applyCSS(getCSS(text,state),classSelected)
            })
        }
        applyCSS(css,classSelected)
        return classSelected
    }
}

const styled = {
    div:(text,...values)=>{
        return main(text,values,'div')
    },
    button:(text,...values)=> {
        return main(text,values,'button')
    },
    span:(text,...values)=> {
        return main(text,values,'span')
    },
    p:(text,...values)=> {
        return main(text,values,'p')
    },
    h1:(text,...values)=> {
        return main(text,values,'h1')
    },
    h2:(text,...values)=> {
        return main(text,values,'h2')
    },
    h3:(text,...values)=> {
        return main(text,values,'h3')
    },
    h3:(text,...values)=> {
        return main(text,values,'h4')
    },
    li:(text,...values)=> {
        return main(text,values,'li')
    },
    a:(text,...values)=> {
        return main(text,values,'a')
    },
    ul:(text,...values)=> {
        return main(text,values,'ul')
    },
    css:(text,...values)=> {
        return main(text,values,'css')
    }
}

module.exports = styled