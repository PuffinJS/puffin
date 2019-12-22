function exeCallbacks(list,currentData){
    list.map(a=>a(currentData))
}

function puffinState(initialData){
    const meThis = this
    meThis.callbacks = []
    const observer = {
        set: function(object, name, value) {
            object[name] = value;
            exeCallbacks(meThis.callbacks,object)
            return true;
        }
    };
    function changed(callback){
        meThis.callbacks.push(callback)
    }
    return {
        changed,
        data:new Proxy(initialData, observer)
    }
}

module.exports = puffinState