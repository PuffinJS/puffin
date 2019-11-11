const { puffin } = require("../../../src/main.js");

const topBar = puffin.element(
  `
      <div id="topbar">
        <li>Home</li>
        <li>Contact</li>
        <li>Source Code</li>
      </div>
    `
);

module.exports = { topBar }