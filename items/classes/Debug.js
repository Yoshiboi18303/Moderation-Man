const colors = require("colors");

module.exports = class Debug {
  constructor(info) {
    this.info = info;

    if (!this.info) throw new Error("This class needs some debug info!");

    const text = "MM-DEBUGGER:".yellow;
    console.info(
      text,
      this.info +
        "\n\n-------------------------------------------------------------\n"
    );
  }
};
