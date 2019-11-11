const parser = require("xml-js");
const puffin = {
  element: function(content, options = { methods: [] }) {
    const output = JSON.parse(parser.xml2json(content));
    output.elements[0].first = true; //Defines the parent element on the component
    const currentComponent = loopThrough({
      arr: output.elements,
      parent: null,
      methods: options.methods,
      components: options.components
    });
    return {
      content: content,
      options: options,
      node: currentComponent.element
    };
  },
  render: (parent, node) => {
    node.innerHTML = "";
    node.appendChild(parent.node);
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

function executeProps(importedComponentProps, currentComponentProps, node) {
  importedComponentProps.map(bd => {
    switch (bd.type) {
      case "text":
        for (let ch of node.getElementsByClassName(bd.class)) {
          currentComponentProps.map(bs => {
            if (bs[bd.value.split("$")[1]] !== undefined) {
              ch.textContent = bs[bd.value.split("$")[1]];
            }
          });
        }
      break;
      case "attribute":
      for (let ch of node.getElementsByClassName(bd.class)) {
        currentComponentProps.map(bs => {
          if (bs[bd.value.split("$")[1]] !== undefined) {
            ch.setAttribute(bd.attribute,bs[bd.value.split("$")[1]])
          }
        });
      }
      break;
    }
  });
}

function loopThrough({ arr, parent, methods, components = {} }) {
  for (let i = 0; i < arr.length; i++) {
    const currentComponent = arr[i];
    const currentComponentProps = getProps(currentComponent);
    let importedComponentProps = []
    if (currentComponent.type === "element") {
      if (isComponentImported(components, currentComponent)) {
        console.log(components)
        var node = Object.assign(components[currentComponent.name].node)
        if( components[currentComponent.name].options){
          const  importedComportentConf =components[currentComponent.name].options;
          if(importedComportentConf && importedComportentConf.props){
            importedComponentProps =
            components[currentComponent.name].options.props;
          }
        }
        isImported = true;
      } else {
        var node = document.createElement(currentComponent.name);
        isImported = false;
      }
      if (currentComponent.attributes !== undefined) {
        Object.keys(currentComponent.attributes).map(attr => {
          const reference = currentComponent.attributes[attr].split("$");
          if(reference[1]!=undefined){
            methods.map(func => {
              if (
                func.name === reference[1]
              ) {
                node.addEventListener(attr,func)
              }
            });
          }else{
            node.setAttribute(attr,reference[0])
          }
        });
      }
    }
    executeProps(importedComponentProps, currentComponentProps, node);
    if (currentComponent.type === "text") {
      parent.innerText = currentComponent.text;
    }
    if(node!=undefined)console.log(node)
    if (currentComponent.type !== "text" && isImported == false) {
      if (parent != null) {
        const result = parent.appendChild(node);
        loopThrough({
          arr: currentComponent.elements,
          parent: result,
          methods: methods,
          components: components,
          props: currentComponent.binds
        })
      } else {
        loopThrough({
          arr: currentComponent.elements,
          parent: node,
          methods: methods,
          components: components,
          props: currentComponent.binds
        })
      }
    } else {
      if (isImported) {
         parent.appendChild(node);
      }
    }

    if (currentComponent.first != undefined) { //Parent element
      if (parent != null) {
        return {
          element: parent
        };
      } else {
        return {
          element: node
        };
      }
      
    }
  }
}

module.exports = { puffin };
