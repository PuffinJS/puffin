const { puffin } = require("../../src/main.js");

const positionComponent = puffin.element(
  `<div mousemove="$scrolling">Component test!</div>`,
  {
    methods: [
      function scrolling(e) {
        this.style = "cursor:pointer";
        this.textContent = `X: ${e.clientX} Y:${e.clientY}`
      }
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
