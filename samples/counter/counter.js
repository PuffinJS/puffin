const { puffin } = require("../../src/main.js");
import 'babel-polyfill'
const positionComponent = puffin.element(
  `<p mousemove="$moving" message="Random number: {{number}} , but attribute">
    --> {{number}}
  </p>`,
  {
    events:{
      mounted(target){
        target.props.number = "Hover me!"
      }
    },
    methods: {
      moving(e) {
        this.props.number = Math.random()
      }
    },
    props:[
      "number"
    ]
  }
);
const componentTest = puffin.element(
  `<button click="$test">Component test!</button>`,
  {
    methods: {
      test() {
        alert("Executed from the component test");
        const clickedEvent = new CustomEvent("clicked", { detail: 'I have been clicked' });

        this.dispatchEvent(clickedEvent);
      }
    }
  }
);

const sharedState = puffin.state({
  count:0
})

const LanguageState = puffin.state({
  Components:'Components'
})

const App = puffin.element(
  `
     <div>
        <h2 lang-string="Components"></h2>
        <positionComponent></positionComponent>
        <positionComponent></positionComponent>
        <componentTest clicked="$clicked">I am an imported component</componentTest>
        <p>Shared counter:</p>
        <button click="$increase">Count: {{count}}</button>
        <button click="$increase">Count: {{count}}</button>
     </div>
  `,
  {
    addons:{
      lang : puffin.lang(LanguageState)
    },
    components: {
      componentTest,
      positionComponent,

    },
    methods: {
      increase() {
        sharedState.data.count++
      },
      clicked(e){
        console.log(e.detail)
      }
    },
    events:{
      fabricated(target){
        console.log("I am fabricated")
      },
      beforeMounted(target){
        console.log("I am going to be mounted")
      },
      mounted(target){
        console.log("I am now mounted")

        target.props.count = sharedState.data.count //Initial value
        
        sharedState.changed(function(data){
          target.props.count = data.count
        })

      }
    },
    props:["count"]
  }
);

puffin.render(App, document.getElementById("app"));

const stateTest = new puffin.state({})

console.log(stateTest)

stateTest.on(['test1','test2','test3'],()=>{
  console.log("something happened !")
})

async function process(){

  await stateTest.on('test1')
  console.log("test1")

  await stateTest.on('test2')
  console.log("test2")
  
  await stateTest.on('test3')
  console.log("test3")
}

process()
