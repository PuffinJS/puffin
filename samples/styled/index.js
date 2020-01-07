const { puffin } = require("../../src/main.js");

const state = new puffin.state({
  static:'red',
  onHovering:'blue'
})

const Button = puffin.style.button`
  ${state}
  &{
    color:{{static}};
  }

  &:hover{
    color:{{onHovering}};
  }
`

const FlexAlign = puffin.style.div`
  ${state}
  &{
    display:flex;
    justify-content:center;
  }
`

const thirdComponent = puffin.element(
  `
     <div> 
        Click the button:
        <FlexAlign>
          <Button click="$change">
            Styled Button
          </Button>
          <Button click="$change">
            Styled Button
          </Button>
          <Button click="$change">
            Styled Button
          </Button>
          <Button click="$change">
            Styled Button
          </Button>
          <Button click="$change">
            Styled Button
          </Button>
        </FlexAlign>
     </div>
  `,
  {
    methods:[
      function change(){
        state.data.static = "green"
        state.data.onHovering = "yellow"
      }
    ],
    components:{
      Button,
      FlexAlign
    }
  }
);

puffin.render(thirdComponent, document.body);
