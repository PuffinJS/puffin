const puffin = require("./puffin")

function generateClass() {
    return `pfn_${(Math.random() + Math.random()).toString().slice(12)}`;
}

function replaceMatchs(text,state){
    let css = text;
    if(state != null){
        Object.keys(state.data).map(function(prop){
            const regex = new RegExp(`{{${prop}}}`,'g')
            css = css.replace(regex,state.data[prop])
        })
    }
    return css
}

function applyCSS(css,target,selector){
    const style = document.createElement("style");
    style.type = "text/css";
    style.rel = "stylesheet";
    target.appendChild(style);
    css.map(function(sy){
        if(sy != ""){
            if(sy.match(/&/g)){
                var rule = sy.replace(/&/g,`.${selector}`)
            }else{
                var rule = `.${selector} ${sy}`
            }
            style.sheet.insertRule(rule)
        }
    })
}

function getCSS(text,state){
   return replaceMatchs(text,state).split('\n\n').map((a)=>a.trim())
}

function main(text,values,tagName){
    let state = null;
    if(values[0] !=undefined){
        state = values[0].info == 'state'?values[0]:null
        text = text[1]
    }else{
        text = text[0]
    }
    const css = getCSS(text,state)
    const classSelected = generateClass()
    const element = puffin.element(`
        <${tagName} class="${classSelected}"></${tagName}>
    `,{
        events:{
            mounted(target){
                if(state != null){
                    state.changed(function(){
                        applyCSS(getCSS(text,state),target,classSelected)
                    })
                }

                applyCSS(css,target,classSelected)
            }
        }
    })
    return element
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
    }
}

module.exports = styled