const colors = require("colors");

module.exports = class BotError extends Error {
  constructor(error_text, error, critical, status_code) {
    super(error_text, error, critical);
    this.error_text = error_text;
    this.error = error;
    this.critical = critical;
    this.status_code = status_code;

    if (!this.error_text) throw new Error(`Error text cannot be undefined.`);
    if (!this.error) throw new Error(`This class needs an error to return.`);
    if (!this.critical)
      throw new Error("Critical error option can't be left out!");
    if (typeof this.error_text != "string")
      throw new Error(
        `Expected error text type to be a type of string, got ${typeof this
          .error_text} instead.`
      );
    if (this.error_text.length <= 0)
      throw new Error("Error text cannot be an empty string!");
    if (typeof this.critical != "boolean")
      throw new Error(
        `Expected critical error type to be a type of boolean, got ${typeof this
          .critical} instead.`
      );
    if (this.critical == true && !this.status_code)
      throw new Error(
        "Error said it was critical, but didn't define a status code to exit with."
      );
    if (this.critical == false && this.status_code)
      throw new Error(
        "Error said it wasn't critical, but defined a status code to exit with."
      );
    if (this.critical == true && typeof this.status_code != "number")
      throw new Error(
        `Expected status code type to be a type of number, got ${typeof this
          .status_code} instead.`
      );

    const starting_text = "MM-BOT-ERROR:".red;
    // Assuming everything is good, then check if critical is true, if so, then log the error, and then exit the process. Otherwise, just log the error.
    if (this.critical == true) {
      console.error(`${starting_text} ${this.error_text}`, this.error);
      return process.exit(this.status_code);
    } else {
      return console.error(`${starting_text}: ${this.error_text}`, this.error);
    }
  }
};
