const { puffin } = require("../../src/main.js");

/**
 * @desc This is a very basic TODO app
 */
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
