const colors = require("colors");

module.exports = class CommandError extends Error {
  constructor(error_text, error) {
    super(error_text, error);
    this.error_text = error_text;
    this.error = error;

    if (!this.error_text || this.error_text.length <= 0)
      throw new Error(`Error text cannot be an empty string or undefined.`);
    if (!this.error) throw new Error(`This class needs an error to return.`);
    if (typeof this.error_text != "string")
      throw new Error(
        `Expected error text type to be a type of string, got ${typeof this
          .error_text} instead.`
      );

    var starting_text = "MM-COMMAND-ERROR:".red;

    // Assuming everything is good, send a error in the console.
    return console.error(`${starting_text} ${this.error_text}`, this.error);
  }
};
