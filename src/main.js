const parser = require("xml-js");
const puffin = {
  element: function(content, options = { methods: [] }, methods) {
    const output = JSON.parse(parser.xml2json(content));
    output.elements[0].first = true; //Defines the parent element on the component
    const currentComponent = loopThrough({
      arr: output.elements,
      parent: null,
      methods: options.methods,
      components: options.components,
      usedMethods:methods
    });
    return {
      content: content,
      options: options,
      node: currentComponent.element,
      methods: currentComponent.usedMethods
    };
  },
  render: (element, parent) => {
    parent.appendChild(element.node);
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

function executeProps(importedComponentProps, currentComponentProps, node) {
  importedComponentProps.map(bd => {
    switch (bd.type) {
      case "text":
        for (let ch of node.getElementsByClassName(bd.class)) {
          currentComponentProps.map(bs => {
            if (bs[bd.value.split("$")[1]] !== undefined) {
              ch.textContent += bs[bd.value.split("$")[1]];
            }
          });
        }
        break;
      case "attribute":
        for (let ch of node.getElementsByClassName(bd.class)) {
          currentComponentProps.map(bs => {
            if (bs[bd.value.split("$")[1]] !== undefined) {
              ch.setAttribute(bd.attribute, bs[bd.value.split("$")[1]]);
            }
          });
        }
        break;
    }
  });
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
  test = ""
}) {
  for (let i = 0; i < arr.length; i++) {
    test += "%% --- "
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
        usedMethods = usedMethods.concat(importedComponent.methods)
        importedComponent.methods.map(met => {
          const element = node.classList.contains(met.classIdentifier)
            ? node
            : node.getElementsByClassName(met.classIdentifier)[0];
          element.addEventListener(met.event.name, met.event.func);
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
    if(importedComponent && importedComponent.options && importedComponent.options.props){
      executeProps(importedComponent.options.props, currentComponentProps, node);
    }
    if (currentComponent.type === "text") {
      parent.innerText = currentComponent.text;
    }
    if (currentComponent.type !== "text" && isImported == false) {
      if (parent != null) {
        const result = parent.appendChild(node);
        const child = loopThrough({
          arr: currentComponent.elements,
          parent: result,
          methods: methods,
          components: components,
          props: currentComponent.binds,
          usedMethods:usedMethods
        });
        if(child != undefined) usedMethods = child.usedMethods
      } else {
        const child = loopThrough({
          arr: currentComponent.elements,
          parent: node,
          methods: methods,
          components: components,
          props: currentComponent.binds,
          usedMethods:usedMethods
        });
        if(child != undefined) usedMethods = child.usedMethods
      }
    } else {
      if (isImported) {
        parent.appendChild(node);
      }
    }
    if (currentComponent.first != undefined) {
      if (parent != null) {
        return {
          element: parent,
          usedMethods: usedMethods
        };
      } else {
        return {
          element: node,
          usedMethods: usedMethods
        };
      }
    }else{
      if(isImported){
        return {
          usedMethods:usedMethods
        }
      } 
    }
  }
}

module.exports = { puffin };
