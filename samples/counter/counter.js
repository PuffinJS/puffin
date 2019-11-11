
const { puffin } = require("../../src/main.js")
 // not working
 
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
        <div>
           <componentTest></componentTest>
        </div>
        <button click="$increase" value="0">Count:0</button>
     </div>
  `,
    {
      components: {
        componentTest
      },
      methods: [
        function increase() {
          this.setAttribute("value", Number(this.getAttribute("value")) + 1);
          this.innerText = `Count: ${this.getAttribute("value")}`
        }
      ]
    }
  );
  
  
  puffin.render(App, document.getElementById("app"));
  