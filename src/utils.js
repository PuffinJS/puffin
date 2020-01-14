function generateClass() {
  return `pfn_${(Math.random() + Math.random()).toString().slice(12)}`;
}

module.exports = {generateClass}