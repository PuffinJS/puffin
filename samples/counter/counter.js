const { puffin } = require("../../src/main.js");

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
  `f<button click="$test">Component test!</button>`,
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

const App = puffin.element(
  `
     <div>
        <h2>Components:</h2>
        <positionComponent></positionComponent>
        <positionComponent></positionComponent>
        <componentTest clicked="$clicked">I am an imported component</componentTest>
        <p>Shared counter:</p>
        <button click="$increase">Count: {{count}}</button>
        <button click="$increase">Count: {{count}}</button>
     </div>
  `,
  {
    components: {
      componentTest,
      positionComponent
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
