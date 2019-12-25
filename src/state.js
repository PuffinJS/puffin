function exeCallbacks(list,currentData){
    list.map(a=>a(currentData))
}

function exeListeners(list,currentData){
    list.map(a=>a.callback(currentData))
}

function puffinState(initialData){
    const meThis = this
    meThis.changedCallbacks = []
    meThis.eventCallbacks = []
    const observer = {
        set: function(object, name, value) {
            object[name] = value;
            exeCallbacks(meThis.changedCallbacks,object)
            return true;
        }
    };
    function changed(callback){
        meThis.changedCallbacks.push(callback)
    }
    function on(eventName,callback){
        meThis.eventCallbacks.push({
            eventName :eventName,
            callback: callback
        })
    }
    function emit(eventName,data){
        exeListeners(meThis.eventCallbacks.filter(a=> a.eventName == eventName),data)
    }
    function triggerChange(object){
        exeCallbacks(meThis.changedCallbacks,object)
    }
    return {
        triggerChange,
        changed,
        on:on,
        emit:emit,
        data:new Proxy(initialData, observer)
    }
}

module.exports = puffinState