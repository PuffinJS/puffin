# PuffinJS

Puffin is a JavaScript library for creating reusable components ready for the web. It doesn't need any transpiling.

## 🤔 Motivation

Puffin is a reactive components UI library made for the web.

## 🔬 Status

Probably have bugs so I don't recommend to use it on production. As you wish.

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

A simple component:

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

## 📜 License

MIT License

Copyright (c) Marc Espín Sanz

[Full license](LICENSE.md)
