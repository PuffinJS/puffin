const { puffin } = require("../../src/main.js");

const StyledButton = puffin.style.button`
  & {
    padding:12px;
    color:white;
    background:black;
    border:none;
  }

  &:hover {
    border:3px solid blue;
  }
`
const App = puffin.element(
  `
     <div>
        <StyledButton>I'm a button</StyledButton>
     </div>
  `,
  {
    components:{
      StyledButton
    },
    props:["count"]
  }
);

puffin.render(App, document.body);
