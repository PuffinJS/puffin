const puffin = require("./puffin.js");
const puffinRouter = require("./router.js")
const puffinState = require("./state.js")

puffin.router = puffinRouter
puffin.state = puffinState

module.exports = { puffin };
