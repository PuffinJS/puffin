const puffin = require("./puffin")

function parseURL(url){
    const parsedURL = url.toString().split(/(\/)|(#)/g).filter(x => Boolean(x))
    let paths = []
    parsedURL.map(function(path,index){
        if(index > 3){
            paths.push({
                name:path
            })
        }
    })
    const returnURL = {
            protocol:parsedURL[0],
            domain:parsedURL[3],
            paths:paths
    }
    return returnURL
}

function matchPath(objectURL,arrayPaths,additional){
    let message = {
        status:false
    }
    arrayPaths.map(function(path){
        const splittedPath = path.path == "/" ? ["/"] : path.path.split('/').filter(Boolean)
        objectURL.paths.map(function(currentPath){
            if(( splittedPath[0] == currentPath.name && splittedPath[0] !== "/" && splittedPath[1] == undefined) || (splittedPath[0] === "/" && objectURL.paths.length == 1) ){
                message = {
                    status : true,
                    component : path.component
                }
            }
        })
    })
    if(message.status == false){
        message = {
            status : true,
            component : additional.lost.component
        }
    }
    return message;
}

function renderBox(configuration,boxId,additionalConfig){
    const currentURL = parseURL(window.location)
    const result = matchPath(currentURL,configuration,additionalConfig)
    if(result.status){
        puffin.render(result.component,document.getElementById(boxId),{
            removeContent:true
        })
    }
}

function puffinRouter(configuration,additionalConfig){
    const boxId = Math.random()
    const data = {
        box: puffin.element(`
            <div id="${boxId}"></div>
        `),
        link: puffin.element(`
                <a click="$click" path="{{path}}" href="#">{{text}}</a>
            `,{
                methods:[
                    function click(){
                        history.replaceState({}, "", this.getAttribute("path"))
                        renderBox(configuration,boxId,additionalConfig)
                    }
                ],
                props:["text","path"]
            })
    }
    window.addEventListener("load",function(){
        renderBox(configuration,boxId,additionalConfig)          
    })
    return data 
}

module.exports = puffinRouter