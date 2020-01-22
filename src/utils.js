function generateClass() {
  return `pfn_${(Math.random() + Math.random()).toString().slice(12)}`;
}

function throwWarn(message) {
  console.warn("puffin warn -->", message);
}

function throwError(message) {
  console.error("puffin error -->", message);
}

module.exports = {generateClass,throwWarn,throwError}