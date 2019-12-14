const { puffin } = require("../../src/main.js");

const comp = puffin.element(
  `
  <div>
    <div message="I am {{name}}" test="ok">This is {{text}}</div>
  </div>`,
  {
    props: ["name","text"]
  }
);
const App = puffin.element(
  `
  <div>
     <comp name="Marc" text="lol"></comp>
  </div>
  `,
  {
    components: {
      comp
    }
  }
);

puffin.render(App, document.getElementById("app"));
