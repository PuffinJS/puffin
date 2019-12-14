const { puffin } = require("../../src/main.js");

const { topBar } = require("./components/topbar.js");

const App = puffin.element(
  `
      <div class="todo">
       <topBar></topBar>
      </div>
    `,
  {
    components: {
        topBar
    }
  }
);

puffin.render(App, document.getElementById("app"));
