# PuffinJS

## 🤔 About

Puffin is a JavaScript library for creating reusable reactive components ready for the web. It doesn't need any transpiling.

## 🔬 Status

Pretty stable but, be careful when using on production. (WIP)

What does it have?
* Reusable components
  * Reactive Props
  * Methods
  * Events
* Basic router 
* Basic centralized state

Ideas:
* Sub-routes

## ⚽ Usage

Installing:
> npm install @mkenzo_8/puffin

Requiring on your project:
> const { puffin } = require("@mkenzo_8/puffin")

You can find some samples on the /samples directory.

### Testing :

Requisites:

* Python
* NodeJS

Install Parcel:
> npm install parcel -g

Run a local server:
> npx parcel  samples/counter/index.html

## Examples

### Reactive component

```javascript

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

puffin.render(App, document.body);
```
### Routing component

```javascript
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

```

### Component using centralized state:

```javascript
const { puffin } = require("../../src/main.js");

const myState = new puffin.state({
  count: 0
})

const firstComponent = puffin.element(
  `
     <div>
        <p>Current: {{count}}</p>
     </div>
  `,
  {
    events:{
      mounted(target){
        target.props.count = myState.data.count
        
        myState.changed(function(data){ //Update local state if global is updated
          target.props.count = data.count
        })
      }
    },
    props:["count"]
  }
);

const secondComponent = puffin.element(
  `
     <div>
        <button click="$add">Add 1 to: {{count}}</button>
     </div>
  `,
  {
    events:{
      mounted(target){
        target.props.count = myState.data.count

        myState.changed(function(data){ //Update local state if global is updated
          target.props.count = data.count
        })
      }
    },
    methods:[
      function add(){
        myState.data.count++ //Updates the global state
      }
    ],
    props:["count"]
  }
);

puffin.render(firstComponent, document.body);
puffin.render(secondComponent, document.body);
```

## 📜 License

MIT License

Copyright (c) Marc Espín Sanz

[Full license](LICENSE.md)
