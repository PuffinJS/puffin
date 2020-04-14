const puffin = require("./puffin.js");
const puffinRouter = require("./router.js")
const puffinState = require("./state.js")
const puffinStyle = require("./style.js")
const puffinLang = require("./languages.js")

const element = require("./methods/element")
const render = require("./methods/render")
const style = require("./methods/style")
const { routerBox, routerLink } = require("./methods/router")

puffin.router = puffinRouter
puffin.state = puffinState
puffin.style = puffinStyle
puffin.lang = puffinLang

module.exports = { puffin, element, render, style, routerBox, routerLink };
