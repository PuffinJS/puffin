/*

  MIT License

  Copyright (c) Marc Espín Sanz

*/

const puffin = {
  element: function(input, options = { methods: [], events: {} }) {
    const parser = require("xml-js");
    let output;
    if(typeof input == "string"){
      output = JSON.parse(parser.xml2json(input,{
        trim:true
      }));
    }else{
      output = input; 
    }
    output.elements[0].first = true; //Defines the parent element on the component
    const currentComponent = loopThrough({
      arr: output.elements,
      parent: null,
      options:options,
      methods: options.methods,
      components: options.components,
      propsConfigured: options.props,
      usedEvents : []
    });
    return {
      options: options,
      node: currentComponent.element,
      methods: currentComponent.usedMethods,
      props: currentComponent.usedProps,
      usedEvents: currentComponent.usedEvents
    };
  },
  render: (element, parent, options = { removeContent: false }) => {
    if (options.removeContent) parent.innerHTML = "";
    parent.appendChild(element.node);
    executeEvent("mounted",element.usedEvents,element.node)
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
      if (element.type == "text") {
        props.push({
          __text: element.text
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

function appendProps(PropsObjects, options, node) {
  if (node.props == undefined)
    node.props = new ObjectObserver(options, node, PropsObjects);
  if (PropsObjects != undefined && node != undefined) {
    PropsObjects.map(prop => {
      const element = node.getElementsByClassName(prop.class)[0] || node;
      if(element.classList.contains(prop.class)) {
        element.props = new ObjectObserver(options, element, PropsObjects);
        setProp({
          object: prop,
          options: options,
          node: element
        });
      }
    });
  }
}

function ObjectObserver(optionalOptions, node, PropsObjects) {
  const observer = {
    set: function(object, propName, propValue) {
      PropsObjects.map(prop => {
        if (prop.name === propName) {
          if(node.classList.contains(prop.class)){
            var element = node;
          }else {
            var element =node.getElementsByClassName(prop.class)[0] 
          }
          if(element != null){
            setProp({
              object: prop,
              options: optionalOptions,
              node: element,
              directValue: propValue
            });
          }
         
        }
      });
      object[propName] = propValue;
      return true;
    }
  };
  return new Proxy({}, observer);
}

function setProp({ object, options = {}, node, directValue = null }) {
  if (object.type === "visible") {
    if (object.attribute === "__text") {
      if(directValue == null && options[object.name] == undefined) return;
      node.textContent = object.value.replace(
        new RegExp(`{{${object.name}}}`,'g'),
        directValue != null ? directValue : options[object.name]
      );
    } else {
      node.setAttribute(
        object.attribute,
        object.value.replace(
          new RegExp(`{{${object.name}}}`,'g'),
          directValue != null ? directValue : options[object.name]
        )
      );
    }
  } else {
    Object.defineProperty(node.props, object.name, {
      value: directValue != null ? directValue : object.value,
      writable: true
    });
  }
}

function generateClass() {
  return `pfn_${(Math.random() + Math.random()).toString().slice(12)}`;
}

function detectEvents(events = {},totalList,node){
  Object.keys(events).map(function(ev){
    const classIdentifier = generateClass();
    totalList.push({
      class:classIdentifier,
      name:ev,
      function:events[ev]
    })
   
    node.classList.add(classIdentifier)
  })
}

function detectProps(ExportedProps, PropsValues, node, totalList) {
  ExportedProps.map(prop => {
    PropsValues.map(attribute => {
      Object.keys(attribute).map(function(name) {
        if (attribute[name].match(`{{${prop}}}`)) {
          const classIdentifier = generateClass();
          totalList.push({
            class: classIdentifier,
            attribute: name,
            value: attribute[name],
            type: "visible",
            name: prop
          });
          node.classList.add(classIdentifier);
        }
      });
    });
    const classIdentifier = generateClass();
    totalList.push({
      class: classIdentifier,
      attribute: name,
      value: null,
      type: "hidden",
      name: prop
    });
    if (node != undefined) node.classList.add(classIdentifier);
  });
}

function getComponentsMethods(usedMethods = [], components) {
  Object.keys(components).map(function(component) {
    if (components[component] != null) {
      components[component].methods.map(a=>usedMethods.push(a))
    }
  });
}

function createElement(Node) {
  if (Node.attributes && Node.attributes.isSVG == "true") {
    return document.createElementNS("http://www.w3.org/2000/svg", Node.name);
  }
  switch (Node.name) {
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
      return document.createElementNS("http://www.w3.org/2000/svg", Node.name);
    default:
      return document.createElement(Node.name);
  }
}
function executeEvent(eventName,usedEvents,node){
  usedEvents.map(function(ev){
    if(eventName == ev.name){
      ev.function(node.getElementsByClassName(ev.class)[0] || node)
    }
  })
}
function appendMethods(currentComponent, node, usedMethods, methods) {
  if (currentComponent.attributes !== undefined) {
    Object.keys(currentComponent.attributes).map(attr => {
      const reference = currentComponent.attributes[attr].split("$");
      if (reference[1] == undefined) {
        if (attr == "class") {
          const classArray = reference[0].split(" ").filter(Boolean);
          classArray.map(className => {
            node.classList.add(className);
          });
        } else {
          node.setAttribute(attr, reference[0]);
        }
      } else {
        methods.map(func => {
          if (func.name === reference[1]) {
            node.addEventListener(attr, func);
            const classIdentifier = generateClass();
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
function appendImportedMethods(importedComponent, isImported, node) {
  if (importedComponent.methods != undefined && isImported) {
    importedComponent.methods.map(met => {
      const elements = node.classList.contains(met.classIdentifier)
        ? [node]
        : node.getElementsByClassName(met.classIdentifier);
      for (let element of elements) {
        element.addEventListener(met.event.name, met.event.func);
      }
    });
  }
}

function randomizeEvents(events,node){
  const newEvents = JSON.parse(JSON.stringify({events})).events
  newEvents.map(function(event,index){
    event.function = events[index].function
    const element = document.getElementsByClassName(event.class)[0] || node
    if(element.classList.contains(event.class)){
      const newClass = generateClass()
      element.classList.replace(event.class,newClass)
      event.class = newClass
    }
  })
  return newEvents
}

function randomizeProps(props,node){
  props.map(function(prop,index){
    const element = document.getElementsByClassName(prop.class)[0] || node
    if(element.classList.contains(prop.class)){
      const newClass = generateClass()
      element.classList.replace(prop.class,newClass)
      prop.class = newClass
    }
  })
}

function cloneComponent(object){
  let importedComponent = {
    methods:Object.assign(object.methods),
    options:Object.assign(object.options),
    props:[],
    usedEvents:Object.assign(object.usedEvents),
    node:Object.assign(object.node)
  }
  object.props.map(function(prop){
    importedComponent.props.push({
      class:prop.class,
      attribute:prop.attribute,
      value:prop.value,
      type:prop.type,
      name:prop.name
    })
  })
  return importedComponent
}

function getNode(components, currentComponent){
  let node;
  let isImported = false;
  var importedComponent = {
    options: {
      props: []
    }
  };
  if (isComponentImported(components, currentComponent)) {
    const object = components[currentComponent.name]
    importedComponent = cloneComponent(object)
    node = importedComponent.node.cloneNode(true);
    isImported = true;
  } else {
    
    node = createElement(currentComponent);
  }
  return {
    isImported,
    node,
    importedComponent
  }
}

function loopThrough({
  arr = [],
  parent,
  methods = [],
  components = {},
  options = {},
  usedMethods = [],
  usedProps = [],
  propsConfigured = [],
  usedEvents = []
}) {
  for (let currentComponent of arr) {
    const currentComponentProps = getProps(currentComponent);
    if (currentComponent.type === "element") {
      var { node,isImported ,importedComponent } = getNode(components, currentComponent)
      appendImportedMethods(importedComponent, isImported, node);
      appendMethods(currentComponent, node, usedMethods, methods);
    }
    detectProps(propsConfigured, currentComponentProps, node, usedProps);
    if (node != undefined){
      if(isImported){
        randomizeProps(importedComponent.props,node)
        importedComponent.props.forEach((prop)=>{
          usedProps.push(prop)
        })
        
      }
      appendProps(usedProps, currentComponent.attributes, node);
    }

    if(currentComponent.type !== "text"  ){
      if(isImported){
        const tempEvents = randomizeEvents(importedComponent.usedEvents,node)
        tempEvents.map(a=>usedEvents.push(a))  
      }else{
        detectEvents(options.events,usedEvents,node)
      }
    }
    if (currentComponent.type === "text") {
      parent.innerText = currentComponent.text;
    }
    if (currentComponent.type !== "text"  ) {
      if (parent != null ) {
        const result = parent.appendChild(node);       
        loopThrough({
          arr: currentComponent.elements,
          parent: result,
          methods: methods,
          usedMethods:usedMethods,
          components: components,
          usedProps: usedProps,
          propsConfigured: propsConfigured,
          usedEvents:usedEvents
        });
      } else {
        loopThrough({
          arr: currentComponent.elements,
          parent: node,
          methods: methods,
          usedMethods:usedMethods,
          components: components,
          usedProps: usedProps,
          propsConfigured: propsConfigured,
          usedEvents:usedEvents
        });
      }
    } else {
      if (isImported ) {
        parent.appendChild(node);
      }
    }
    if (currentComponent.first != undefined) {
      executeEvent("fabricated",usedEvents,node)
      getComponentsMethods(usedMethods, components);
      if (parent != null) {
        return {
          element: parent,
          usedMethods: usedMethods,
          propsConfigured: propsConfigured,
          usedProps: usedProps,
          usedEvents:usedEvents
        };
      } else {
        return {
          element: node,
          usedMethods: usedMethods,
          propsConfigured: propsConfigured,
          usedProps: usedProps,
          usedEvents:usedEvents
        };
      }
    }
  }
}

module.exports = puffin;