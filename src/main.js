/*

MIT License

Copyright (c) Marc Espin Sanz

*/
const puffin = {
  element: function(content, options = { methods: [],events:{} }) {
    const parser = require("xml-js");
    const output = JSON.parse(parser.xml2json(content));
    output.elements[0].first = true; //Defines the parent element on the component
    const currentComponent = loopThrough({
      arr: output.elements,
      parent: null,
      methods: options.methods,
      components: options.components,
      propsConfigured:options.props
    });
    return {
      content: content,
      options: options,
      node: currentComponent.element,
      methods: currentComponent.usedMethods,
      props:currentComponent.usedProps
    };
  },
  render: (element, parent) => {
    parent.appendChild(element.node);
    if(element.options.events && element.options.events.mounted){
      element.options.events.mounted(element.node)
    }
  }
};
function isComponentImported(componentsArray, currentComponent) {
  if (
    Object.keys(componentsArray).filter(comp => {
      return comp == currentComponent.name;
    })[0] != undefined
  ) {
    return true;
  } else {
    return false;
  }
}
function getProps(currentComponent) {
  let props = [];
  if (currentComponent.attributes != undefined) {
    Object.keys(currentComponent.attributes).map((attr, index) => {
      props.push({
        [attr]: currentComponent.attributes[attr]
      });
    });
  }
  if (currentComponent.elements != undefined) {
    currentComponent.elements.map((element, index) => {
      if(element.type == "text"){
        props.push({
          "__text": element.text
        });
      }
    });
  }
  return props;
}

function isContainer(nodeName) {
  switch (nodeName) {
    case "DIV":
      return true;
  }
}

function throwWarn(message) {
  console.warn("puffin warn -->", message);
}

function throwError(message) {
  console.error("puffin error -->", message);
}

function appendProps(PropsObjects,options,node) {
  if(node.props == undefined) node.props = new ObjectObserver(options,node,PropsObjects)
  if(PropsObjects != undefined && node != undefined){
    PropsObjects.map((prop)=>{
      const element = node.getElementsByClassName(prop.class)[0] || node
      setProp({
        object:prop,
        options:options,
        node:element
      })
    })
  }
  
}

function ObjectObserver(optionalOptions,node,PropsObjects){
  const observer = {
    set: function(object, propName, propValue) {
        PropsObjects.map((prop)=>{
          const element = node.getElementsByClassName(prop.class)[0] || node
          setProp({
            object:prop,
            options:optionalOptions,
            node:element,
            directValue:propValue
          })
        })
      object[propName] = propValue;
      return true;
    }
  };
  return new Proxy({}, observer);
}

function setProp({object,options,node,directValue = null}){
  if(object.type === "visible"){
    if(object.attribute === "__text"){
      node.textContent = object.value.replace(`{{${object.name}}}`,directValue!= null? directValue:options[object.name])
    }else{
      node.setAttribute(object.attribute,object.value.replace(`{{${object.name}}}`,directValue!= null? directValue:options[object.name]))
    }
  }else{
    Object.defineProperty(node.props,[object.name],{
      value: directValue!= null? directValue:object.value,
      writable:true
    })
  }
}

function generateClass(){
  return `pfn_${(Math.random() + Math.random()).toString().slice(12)}`
}

function detectProps(ExportedProps, PropsValues, node,totalList) {
  ExportedProps.map(prop => {
    PropsValues.map(attribute => {
      Object.keys(attribute).map(function(name){
        if(attribute[name].match(`{{${prop}}}`)){
          const classIdentifier = generateClass()
          totalList.push({
            class:classIdentifier,
            attribute:name,
            value:attribute[name],
            type:"visible",
            name:prop
          })
          node.classList.add(classIdentifier)
        }
      })
    });
    const classIdentifier = generateClass()
    totalList.push({
      class:classIdentifier,
      attribute:name,
      value:null,
      type:"hidden",
      name:prop
    })
   if(node!=undefined) node.classList.add(classIdentifier)
  });
}

function getComponentsMethods(usedMethods=[],components){
  Object.keys(components).map(function(component){
    if(components[component] != null){
      usedMethods = usedMethods.concat(components[component].methods)
    }
  })
  return usedMethods;
}

function createElement(Node){
    if(Node.attributes && Node.attributes.isSVG == "true"){
      return document.createElementNS("http://www.w3.org/2000/svg",Node.name);
    }
  switch(Node.name){
    case "g":
    case "defs":
    case "stop":
    case "linearGradient":
    case "feColorMatrix":
    case "feBlend":
    case "filter":
    case "path":
    case "group":
    case "polyline":
    case "line":
    case "rect":
    case "circle":
    case "svg":
      return document.createElementNS("http://www.w3.org/2000/svg",Node.name);
    default:
      return document.createElement(Node.name)
  }
}
function loopThrough({
  arr = [],
  parent,
  methods = [],
  components = {},
  usedMethods = [],
  usedProps = [],
  propsConfigured = []
}) {
  for (let i = 0; i < arr.length; i++) {
    const currentComponent = arr[i];
    const currentComponentProps = getProps(currentComponent);
    let importedComponent = {
      options: {
        props: []
      }
    };
    if (currentComponent.type === "element") {
      if (isComponentImported(components, currentComponent)) {
        var node = components[currentComponent.name].node.cloneNode(true);
        importedComponent = components[currentComponent.name];
        isImported = true;
      } else {
        var node = createElement(currentComponent);
        isImported = false;
      }
      if (importedComponent.methods != undefined && isImported) {
        importedComponent.methods.map(met => {
          const elements = node.classList.contains(met.classIdentifier)
            ? [node]
            : node.getElementsByClassName(met.classIdentifier);
            for(let element of elements){
              element.addEventListener(met.event.name, met.event.func);
            }
        });
      }
      if (currentComponent.attributes !== undefined) {
        Object.keys(currentComponent.attributes).map(attr => {
          const reference = currentComponent.attributes[attr].split("$");
          if (reference[1] == undefined) {
            if (attr == "class") {
              const classArray = reference[0].split(" ").filter(Boolean);
              classArray.map((className)=>{
                node.classList.add(className);
              })

            } else {
              node.setAttribute(attr, reference[0]);
            }
          } else {
            methods.map(func => {
              if (func.name === reference[1]) {
                node.addEventListener(attr, func);
                const classIdentifier = generateClass()
                node.classList.add(classIdentifier);
                usedMethods.push({
                  classIdentifier: classIdentifier,
                  event: {
                    name: attr,
                    func: func
                  }
                });
              }
            });
          }
        });
      }
    }
    detectProps(propsConfigured, currentComponentProps, node,usedProps)
    if(isComponentImported(components, currentComponent)){
      appendProps(importedComponent.props, currentComponent.attributes, node);
    }else{
      if(node != undefined)  appendProps(usedProps,currentComponent.attributes,node)
    }
    if (currentComponent.type === "text") {
      parent.innerText = currentComponent.text;
    }
    if (currentComponent.type !== "text" && isImported == false) {
      if (parent != null) {
        const result = parent.appendChild(node);
          loopThrough({
            arr: currentComponent.elements,
            parent: result,
            methods: methods,
            components: components,
            usedProps: usedProps,
            propsConfigured:propsConfigured
          });
      } else {
          loopThrough({
            arr: currentComponent.elements,
            parent: node,
            methods: methods,
            components: components,
            usedProps: usedProps,
            propsConfigured:propsConfigured
          });
      }
    } else {
      if (isImported) {
        parent.appendChild(node);
      }
    }
    if (currentComponent.first != undefined) {
      usedMethods = getComponentsMethods(usedMethods,components)
      if (parent != null) {
        return {
          element: parent,
          usedMethods: usedMethods,
          propsConfigured:propsConfigured,
          usedProps:usedProps
        };
      } else {
        return {
          element: node,
          usedMethods: usedMethods,
          propsConfigured:propsConfigured,
          usedProps:usedProps
        };
      }
    }
  }
}

module.exports = { puffin };
