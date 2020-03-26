const { puffin } = require("../../src/main.js");

const myState = new puffin.state({
  count: 0
})

myState.on('restarted',a=>{
  myState.data.count = 0
})

const firstComponent = puffin.element(
	`
	<div>
		<p>Current: {{count}} and {{count}} and... finally {{count}} 😂</p>
	</div>
	`,
	{
		props:[{
			name:'count',
			value:0
		}]
	}
);

const secondComponent = puffin.element(
	`
	<div count="{{count}}"> 
		<firstComponent/>
		<button click="$add">Add 1 to: {{count}}</button>
		<button click="$restart">Restart</button>
	</div>
	`,
	{
		events:{
			mounted(target){
				myState.changed(function(data){ //Update local state if global is updated
					target.props.count = myState.data.count
				})
				console.log(myState.data.count)
			}
		},
		methods:{
			add(){
				myState.data.count++ //Updates the global state
			},
			restart(){
				myState.emit('restarted',0)
			}
		},
		props:[{
			name:'count',
			value:0
		}],
		components:{
			firstComponent
		}
	}
);


puffin.render(secondComponent, document.body);