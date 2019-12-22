const { puffin , puffinRouter } = require("../../src/main.js");

const Home = puffin.element(
  `
    <div>
      <p>You are now in home page </p>
    </div>
  `
);

const Contact = puffin.element(
  `
    <p>You are now in contact page </p>
  `,
);

const router = new puffin.router([
  {
    path:'/home',
    component:Home
  },
  {
    path:'/contact',
    component:Contact
  }
])

const App = puffin.element(
  `
    <div>
      <routerLink text="go home" path="/home"/>
      <routerLink text="go contact" path="/contact"/>
      <routerBox/>
    </div>
  `,
  {
    components: {
      routerBox: router.box,
      routerLink:router.link
    }
  }
);

puffin.render(App, document.getElementById("app"));
