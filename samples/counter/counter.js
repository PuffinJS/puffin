const { puffin } = require("../../src/main.js");

const positionComponent = puffin.element(
  `<p mousemove="$moving" message="Random number: {{number}} , but attribute">
    --> {{number}}
  </p>`,
  {
    events:{
      mounted(target){
        target.props.number = "Hover me!"
      }
    },
    methods: [
      function moving(e) {
        this.props.number = Math.random()
      }
    ],
    props:[
      "number"
    ]
  }
);
console.log(positionComponent)
const componentTest = puffin.element(
  `<button click="$test">Component test!</button>`,
  {
    methods: [
      function test() {
        alert("Executed from the component test");
      }
    ]
  }
);

const sharedState = puffin.state({
  count:0
})

const App = puffin.element(
  `
     <div>
        <positionComponent></positionComponent>
        <positionComponent></positionComponent>
        <componentTest>I am an imported component</componentTest>
        <p>Shared counter:</p>
        <button click="$increase">Count: {{count}}</button>
        <button click="$increase">Count: {{count}}</button>
     </div>
  `,
  {
    components: {
      componentTest,
      positionComponent
    },
    methods: [
      function increase() {
        sharedState.data.count++
      }
    ],
    events:{
      mounted(target){
        target.props.count = sharedState.data.count //Initial value

        sharedState.changed(function(data){
          target.props.count = data.count
        })

      }
    },
    props:["count"]
  }
);

puffin.render(App, document.getElementById("app"));
