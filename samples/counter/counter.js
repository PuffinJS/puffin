const { puffin } = require("../../src/main.js");

const positionComponent = puffin.element(
  `<p mousemove="$moving" message="Random number: {{count}} , but attribute">
    {{count}}
  </p>`,
  {
    events:{
      mounted(target){
        target.props.count = "Hover me!"
      }
    },
    methods: [
      function moving(e) {
        this.props.count = Math.random()
      }
    ],
    props:[
      "count"
    ]
  }
);

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

const App = puffin.element(
  `
     <div>
        <positionComponent></positionComponent>
        <componentTest></componentTest>
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
        this.props.count++;  //Increase the count by one on clicking
      }
    ],
    events:{
      mounted(target){
        target.props.count = 0 //Initial value
      }
    },
    props:["count"]
  }
);


const test = puffin.element(
  `<App count="0"/>`,
  {
    components:{App}
  }
);

puffin.render(test, document.getElementById("app"));
