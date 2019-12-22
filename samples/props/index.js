const { puffin } = require("../../src/main.js");

const myState = new puffin.state({
  count: 0
})

const firstComponent = puffin.element(
  `
     <div>
        <p>Current: {{count}}</p>
     </div>
  `,
  {
    events:{
      mounted(target){
        target.props.count = myState.data.count
        
        myState.changed(function(data){ //Update local state if global is updated
          target.props.count = data.count
        })
      }
    },
    props:["count"]
  }
);

const secondComponent = puffin.element(
  `
     <div>
        <button click="$add">Add 1 to: {{count}}</button>
     </div>
  `,
  {
    events:{
      mounted(target){
        target.props.count = myState.data.count

        myState.changed(function(data){ //Update local state if global is updated
          target.props.count = data.count
        })
      }
    },
    methods:[
      function add(){
        myState.data.count++ //Updates the global state
      }
    ],
    props:["count"]
  }
);

puffin.render(firstComponent, document.body);
puffin.render(secondComponent, document.body);