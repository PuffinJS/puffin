const { puffin } = require("../../src/main.js");

const myState = new puffin.state({
  count: 0
})

myState.on('restarted',a=>{
  myState.data.count = a
  console.log("restarted")
})

const firstComponent = puffin.element(
  `
     <div>
        <p>Current: {{count}}{{count}}{{count}}</p>
     </div>
  `,
  {
    events:{
      imported(target){
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
        <firstComponent/>
        <button click="$add">Add 1 to: {{count}}</button>
        <button click="$restart">Restart</button>
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
      },
      function restart(){
        myState.emit('restarted',0)
      }
    ],
    props:["count"],
    components:{
      firstComponent
    }
  }
);


puffin.render(secondComponent, document.body);