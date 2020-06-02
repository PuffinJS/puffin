function generateClass() {
	return `p_${(Math.random() + Math.random()).toString().slice(Math.random())}`;
}

function throwWarn(message) {
	console.warn("Puffin Warn:: ", message);
}

function throwError(message) {
	console.error("Puffin Err:: ", message);
}

export { generateClass, throwWarn, throwError }