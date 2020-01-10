const { puffin } = require("../../src/main.js");

const Home = puffin.element(
  `
    <div>
      <p>You are now in home page </p>
    </div>
  `
);

const SubRouting = puffin.element(
  `
    <div>
      <p>This is SubRouting page </p>
    </div>
  `,
);

const Lost = puffin.element(
  `
    <p>You are lost...</p>
  `,
);

const subroute1 = puffin.element(
  `
    <p>This is subroute 1!</p>
  `,
);

const subroute2 = puffin.element(
  `
    <p>This is subroute 2</p>
  `,
);

const router = new puffin.router([
  {
    path:'/', //Fallback to home when no section is specified
    component:Home
  },
  {
    path:'/home',
    component:Home
  },
  {
    path:'/subrouting',
    component:SubRouting,
    paths:[
      {
        path:'/subroute1',
        component:subroute1,
        paths:[
          {
            path:'/subroute2',
            component:subroute2
          }
        ]
      }
    ]
  }
],{
  lost:{
    component:Lost
  }
})

const App = puffin.element(
  `
    <div>
      <routerLink text="go home " path="/home"/>
      <routerLink text="go to subrouting " path="/subrouting"/>
      <routerLink text="go to subroute1 " path="/subrouting/subroute1"/>
      <routerLink text="go to subroute2 " path="/subrouting/subroute1/subroute2"/>
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