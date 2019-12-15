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

function appendProps(PropsObjectes,PropsValues,options,node) {
  if(PropsObjectes != undefined && node != undefined){
    PropsObjectes.map((prop)=>{
      const element = node.getElementsByClassName(prop.class)[0]
      if(prop.attribute != "__text"){
        element.setAttribute(prop.attribute,prop.value.replace(`{{${prop.name}}}`,options[prop.name]))
      }else{
        element.textContent = prop.value.replace(`{{${prop.name}}}`,options[prop.name])
      }
    })
  }
}

function detectProps(ExportedProps, PropsValues, node,totalList) {
  ExportedProps.map(prop => {
    PropsValues.map(attribute => {
      Object.keys(attribute).map(function(name){
        if(attribute[name].match(`{{${prop}}}`)){
          const classIdentifier = `puffin${Math.random() + Math.random()}`;
          totalList.push({
            class:classIdentifier,
            attribute:name,
            value:attribute[name],
            name:prop
          })
          node.classList.add(classIdentifier)
        }
      })
    });
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
                const classIdentifier = `puffin${Math.random() +
                  Math.random()}`;
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
      appendProps(importedComponent.props,currentComponentProps, currentComponent.attributes,node);
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
