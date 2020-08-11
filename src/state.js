function exeCallbacks(list){
	list.map(a => a.callback(...Array.from(arguments).slice(1)))
}

function puffinState(initialData = {}){
	const self = this
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
		events.map( eventToRegister => {
			if(!this.eventCallbacks[eventToRegister]) this.eventCallbacks[eventToRegister] = []
			if( callback ){
				this.eventCallbacks[eventToRegister].push({
					callback
				})
				gottaReturn = {
					cancel: () => cancelEvent(this.eventCallbacks[eventToRegister], callback)
				}
			}else{
				gottaReturn = new Promise(()=>{
					this.eventCallbacks[eventToRegister].push({
						callback
					})
				}).resolve
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
	const once = (eventName, callback) => {
		if(!this.eventCallbacks[eventName]) this.eventCallbacks[eventName] = []
		const customCallback = function() {
			callback(...arguments)
			cancelEvent(self.eventCallbacks[eventName], customCallback)
		}
		this.eventCallbacks[eventName].push({
			callback: customCallback
		})
	}
	return {
		triggerChange,
		changed,
		keyChanged,
		on,
		once,
		emit,
		data: new Proxy(initialData, observer),
		info: 'state'
	}
}

export default puffinState