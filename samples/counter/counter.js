const { puffin } = require("../../src/main.js");

const positionComponent = puffin.element(
  `<p mousemove="$moving" message="Random number: {{count}} , but attribute">
    {{count}}
  </p>`,
  {
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

const increaseMe = puffin.element(`
  <button click="$increment" count="{{count}}">Count: {{count}}</button>
`,{
  methods:[
    function increment(){
      this.props.count++   
    }
  ],
  props:["count"]
})

const App = puffin.element(
  `
     <div>
        <button click="$increase">Count: {{count}}</button>
     </div>
  `,
  {
    events:{
      mounted(target){
        target.props.count = 0 //Initial value
      }
    },
    methods: [
      function increase() {
        this.props.count++;  //Increase the count by one on clicking
      }
    ],
    props:["count"]
  }
);

puffin.render(App, document.getElementById("app"));
