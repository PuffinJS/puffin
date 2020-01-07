const puffin = require("./puffin.js");
const puffinRouter = require("./router.js")
const puffinState = require("./state.js")
const puffinStyle = require("./style.js")

puffin.router = puffinRouter
puffin.state = puffinState
puffin.style = puffinStyle

module.exports = { puffin };
