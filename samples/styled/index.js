const { puffin } = require("../../src/main.js");

const state = new puffin.state({
  firstColor:'red',
  secondColor:'blue'
})

const Button = puffin.style.button`
  ${state}
  &{
    color:{{firstColor}};
    padding:10px;
    border-radius:5px;
    border:2px solid {{firstColor}};
    margin:3px;
  }
`

const FlexAlign = puffin.style.div`
  ${state}
  &{
    transition:0.2s;
    display:flex;
    justify-content:center;
    padding:20px;
    border:3px solid {{firstColor}};
  }
  &:hover {
    transition:0.2s;
    border:3px solid {{secondColor}};
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
          <Button click="$change" class="${puffin.style.css`
            &{
              background:lightblue;
              border:0;
              border-radius:5px;
              transition:0.2s;
            }
            &:hover{
              border-radius:50px;
              transition:0.2s;
            }
          `}">
            Inline styling
          </Button>
        </FlexAlign>
        <manualComp/>
     </div>
  `,
  {
    methods:{
      change(){
        state.data.firstColor = "green"
        state.data.secondColor = "yellow"
      }
    },
    components:{
      Button,
      FlexAlign,
      manualComp
    }
  }
);

puffin.render(thirdComponent, document.body);
