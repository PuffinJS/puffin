function exeCallbacks(list){
	list.map(a => a.callback(...Array.from(arguments).slice(1)))
}

function puffinState(initialData){
	const meThis = this
	meThis.changedCallbacks = []
	meThis.keyChangedCallbacks = []
	meThis.eventCallbacks = []
	const observer = {
		set(object, name, value) {
			object[name] = value;
			exeCallbacks(meThis.changedCallbacks,object,name)
			exeCallbacks(meThis.keyChangedCallbacks.filter(a => a.keyName === name),value)
			return true;
		}
	};
	function changed(callback){
		meThis.changedCallbacks.push({callback})
		return {
			cancel:()=>cancelEvent(meThis.changedCallbacks,callback)
		}
	}
	function keyChanged(keyName,callback){
		meThis.keyChangedCallbacks.push({
			keyName,
			callback
		})
		return {
			cancel: () => cancelEvent(meThis.keyChangedCallbacks, callback)
		}
	}
	function cancelEvent(list,callback){
		list.map((event, index) => {
			if( callback == event.callback ){
				list = list.splice(index,1)
			}
		})
	}
	function on(eventName, callback){
		let events = []
		let gottaReturn
		if(typeof eventName == "object"){
			events = eventName
		}else{
			events.push(eventName)
		}
		events.map( eventToRegister => {
			if( callback ){
				meThis.eventCallbacks.push({
					eventName :eventToRegister,
					callback: callback
				})
				gottaReturn = {
					cancel: () => cancelEvent(meThis.eventCallbacks,callback)
				}
			}else{
				gottaReturn = new Promise((resolve,reject)=>{
					meThis.eventCallbacks.push({
						eventName :eventToRegister,
						callback:resolve
					})
				})
			}
		})
		return gottaReturn
	}
	function emit(eventName,data){
		exeCallbacks(meThis.eventCallbacks.filter(a=> a.eventName == eventName),data)
	}
	function triggerChange(object){
		exeCallbacks(meThis.changedCallbacks,object)
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

module.exports = puffinState