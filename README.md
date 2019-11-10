# PuffinJS

Puffin is a JavaScript library for creating reusable components ready for the web. It doesn't need any transpiling.

## 🤔 Motivation

Puffin can be used easier than other libraries since it doesn't need to be compiled. It's ready to be used always.

## 🔬 Status

This is still on testing, not made for production usage.

## ⚽ Samples

You can find some samples on the /test directory.

You can test them with parcel:

```shell
npx parcel  test/index.html
```

## Examples

A simple component:

```javascript
const App = puffin.element(
  `
     <div>
        <button onClick="$increase" value="0">Count: 0</button>
     </div>
  `,
  {
    methods: [
      function increase() {
        this.setAttribute("value", Number(this.getAttribute("value")) + 1);
        this.innerText = `Count: ${this.getAttribute("value")}`;
      }
    ]
  }
);

puffin.render(App, document.body);
```

## 📜 License

MIT License

Copyright (c) Marc Espin Sanz

[Full license](LICENSE.md)
