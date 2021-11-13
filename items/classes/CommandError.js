module.exports = class CommandError extends Error {
  constructor(error_text, error) {
    super(error_text, error);
    console.error(`MM-COMMAND-ERROR: ${this.error_text}`, this.error);
  }
};
