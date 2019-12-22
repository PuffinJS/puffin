import puffin from './puffin'

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
    console.log(parsedURL)
   const returnURL = {
        protocol:parsedURL[0],
        domain:parsedURL[3],
        paths:paths
   }
   return returnURL
}

function matchPath(objectURL,arrayPaths){
    let message = {
        status:false
    }
    console.log(objectURL.paths)
    arrayPaths.map(function(path){
        objectURL.paths.map(function(currentPath){
            const splittedPath = path.path == "/" ? "/" : path.path.split('/')[1]
            if( splittedPath == currentPath.name){
                message = {
                    status : true,
                    component : path.component
                }
            }
        })
    })
    return message;
}

function renderBox(configuration,boxId){
    const currentURL = parseURL(window.location)
    const result = matchPath(currentURL,configuration)
    if(result.status){
        puffin.render(result.component,document.getElementById(boxId),{
            removeContent:true
        })
    }
}

function puffinRouter(configuration){
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
                        renderBox(configuration,boxId)
                    }
                ],
                props:["text","path"]
        })
    }
    window.addEventListener("load",function(){
        renderBox(configuration,boxId)          
    })
    return data 
}

module.exports = puffinRouter