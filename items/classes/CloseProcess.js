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
    if (typeof this.status_code != "integer")
      throw new Error(
        `Expected status code to be a type of integer, got ${typeof this
          .status_code} instead.`
      );

    if (client.ready) {
      client.user.setActivity("Closing Process... see you soon!", {
        type: "PLAYING",
      });
    }
    setTimeout(() => {
      console.log("Closing process...");
      setTimeout(() => {
        client.destroy();
        console.log(
          "Discord client destroyed, still trying to close the process..."
        );
        setTimeout(() => {
          console.log(
            `This process has been closed for reason ${this.reason}.`
          );
          return cp.exit(this.status_code);
        }, 4500);
      }, 5000);
    }, 3500);
  }
};
