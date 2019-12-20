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

const App = puffin.element(
  `
     <div>
        <positionComponent count="0"></positionComponent>
        <componentTest></componentTest>
        <button click="$increase" value="0">Count:0</button>
     </div>
  `,
  {
    components: {
      componentTest,
      positionComponent
    },
    methods: [
      function increase() {
        this.setAttribute("value", Number(this.getAttribute("value")) + 1);
        this.innerText = `Count: ${this.getAttribute("value")}`;
      }
    ]
  }
);

puffin.render(App, document.getElementById("app"));
