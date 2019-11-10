
const { puffin } = require("../src/main.js")

const componentTest = puffin.element(
    `<button onClick="$test">Component test!</button>`,
    {
      methods: [
        function test() {
          alert("Test!");
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
        <button onClick="$increase" value="0">Count:0</button>
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
  