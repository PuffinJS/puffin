const { puffin } = require("../../src/main.js");

const state = new puffin.state({
  static:'red',
  onHovering:'blue'
})

const Button = puffin.style.button`
  ${state}
  &{
    color:{{static}};
    padding:10px;
  }
`

const FlexAlign = puffin.style.div`
  ${state}
  &{
    transition:0.2s;
    display:flex;
    justify-content:center;
    padding:20px;
    border:3px solid {{static}};
  }
  &:hover {
    transition:0.2s;
    border:3px solid {{onHovering}};
  }
  body{
    background:#F1F1F1;
  }
`

const manualComp = puffin.element({
  elements:[
    {
      name:'p',
      type:'element',
      elements:[
        {
          type:'text',
          text:'Manual component'
        }
      ]
    }
  ]
})

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
        <manualComp/>
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
      FlexAlign,
      manualComp
    }
  }
);

puffin.render(thirdComponent, document.body);
