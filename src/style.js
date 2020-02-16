const puffin = require("./puffin")

const {generateClass,throwError,throwWarn} = require("./utils")

function replaceMatchs(text,state){
    let rules = text.split(/[\}]$/gm).map((a)=>{
        return {
            sheet:a.trim(),
            reactive:false
        }
    })
    rules = rules.map((rule)=>{
        if(state != null){
            Object.keys(state.data).map(function(prop){
                const regex = new RegExp(`{{${prop}}}`,'g')
                rule.sheet = rule.sheet.replace(regex,state.data[prop])
                rule.reactive = true
            })
        }else{
            if(rule.sheet.match(/({{)/g)){
                throwWarn('There is no state passed icx nto style: '+text)
            }
        }
        return rule
    })
    return rules
}

function applyCSS(css,selector,reactive = false){
    const style = document.createElement("style");
    style.type = "text/css";
    style.rel = "stylesheet";
    style.classList.add(`${selector}_style`)
    document.head.appendChild(style);
    css.map(function(sy){
        if(sy.sheet != "" && (sy.reactive || reactive)){
            if(sy.sheet.match(/&/g)){
                var rule = sy.sheet.replace(/&/g,`.${selector}`)
                rule += " } "
            }else if(sy.sheet.match(/(body)||(html)/g)){
                var rule = sy.sheet;
            }else{
                var rule = `.${selector} ${sy.sheet} }`
            }
            style.sheet.insertRule(rule)
        }
    })
    if(document.getElementsByClassName(`${selector}_style`).length > 2){
        document.getElementsByClassName(`${selector}_style`)[0].remove()
    }
}

function getCSS(text,state){
   return replaceMatchs(text,state)
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
                    applyCSS(css,classSelected,true)
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
        applyCSS(getCSS(text,state),classSelected,true)
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
    h4:(text,...values)=> {
        return main(text,values,'h4')
    },
    h5:(text,...values)=> {
        return main(text,values,'h5')
    },
    h6:(text,...values)=> {
        return main(text,values,'h6')
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
