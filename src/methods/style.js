
function style( inputCss ){
	const computedArguments = [...arguments].slice(1,[...arguments].length)
	const { output ,binds } = parseBinds(inputCss,computedArguments)
	const randomClass = generateClass()
	const styleEle = document.createElement('style')
	styleEle.type = "text/css";
    styleEle.rel = "stylesheet";
	styleEle.textContent = output.replace(/&/gm,`.${randomClass}`)
	styleEle.classList = randomClass
	document.head.appendChild(styleEle)
	return randomClass
}

const parseBinds = ( input, methods ) => {
	let output = input.join("to__BIND")
	const bindsMatched = output.match(/to__BIND/g)
	const bindsLength = bindsMatched && bindsMatched.length
	const computedBinds = []
	for( let i = 0; i<bindsLength;i++){
		output = output.replace('to__BIND',`$BIND${i} `)
		computedBinds.push(methods[i])
	}
	
	return {
		output,
		binds:computedBinds
	}
}

function generateClass() {
  return `pfn_${(Math.random() + Math.random()).toString().slice(12)}`;
}

module.exports = style