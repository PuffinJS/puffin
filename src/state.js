function exeCallbacks(list){
	list.map(a => a.callback(...Array.from(arguments).slice(1)))
}

function puffinState(initialData){
	this.changedCallbacks = []
	this.keyChangedCallbacks = {}
	this.eventCallbacks = {}
	const observer = {
		set: (object, name, value) => {
			object[name] = value;
			exeCallbacks(this.changedCallbacks,object,name)
			exeCallbacks(this.keyChangedCallbacks[name] || [],value)
			return true;
		}
	};
	const changed = (callback) => {
		this.changedCallbacks.push({callback})
		return {
			cancel:() => cancelEvent(this.changedCallbacks,callback)
		}
	}
	const keyChanged = (keyName, callback) => {
		if( !this.keyChangedCallbacks[keyName] ) this.keyChangedCallbacks[keyName] = []
		this.keyChangedCallbacks[keyName].push({
			callback
		})
		return {
			cancel: () => cancelEvent(this.keyChangedCallbacks[keyName], callback)
		}
	}
	const cancelEvent = (list, callback) => {
		list.map((event, index) => {
			if( callback == event.callback ){
				list = list.splice(index,1)
			}
		})
	}
	const on = (eventName, callback) => {
		let events = []
		let gottaReturn
		if(typeof eventName == "object"){
			events = eventName
		}else{
			events.push(eventName)
		}
		if(!this.eventCallbacks[eventName]) this.eventCallbacks[eventName] = []
		events.map( eventToRegister => {
			if( callback ){	
				this.eventCallbacks[eventName].push({
					callback
				})
				gottaReturn = {
					cancel: () => cancelEvent(this.eventCallbacks[eventName],callback)
				}
			}else{
				gottaReturn = new Promise(()=>{
					this.eventCallbacks[eventName].push({
						callback
					})
				})
			}
		})
		return gottaReturn
	}
	const emit = (eventName,data) => {
		exeCallbacks(this.eventCallbacks[eventName] || [],data)
	}
	const triggerChange = (object) => {
		exeCallbacks(this.changedCallbacks,object)
	}
	return {
		triggerChange,
		changed,
		keyChanged,
		on: on,
		emit: emit,
		data: new Proxy(initialData, observer),
		info: 'state'
	}
}

export default puffinState