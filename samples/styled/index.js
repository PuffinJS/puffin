const { element, style, state, render } = require("../../src/main.js");

const styleWrapper = style`
	& {
		background: lightgray;
		padding:30px;
	}
`

const App = element`
	<div class="${styleWrapper}">
		<p> Hello World </p>
	</div>
`

render(App, document.body);
