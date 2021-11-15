module.exports = class CloseProcess {
  constructor(reason, status_code) {
    this.reason = reason;
    this.status_code = status_code;

    if (!this.reason)
      throw new Error("This class needs a reason for the closed process!");
    if (!this.status_code)
      throw new Error("This class needs a status code for the closed process!");
    if (typeof this.reason != "string")
      throw new Error(
        `Expected reason type to be a type of string, got ${typeof this
          .reason} instead.`
      );
    if (typeof this.reason != "integer")
      throw new Error(
        `Expected reason type to be a type of integer, got ${typeof this
          .reason} instead.`
      );

    console.log("Closing process...");
    client.destroy();
    console.log("Client destroyed, still trying to close the process...");
    setTimeout(() => {
      console.log(`This process has been closed for reason ${this.reason}.`);
      return cp.exit(this.status_code);
    }, 4500);
  }
};
