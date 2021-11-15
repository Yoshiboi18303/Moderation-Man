module.exports = class CloseProcess {
  constructor(reason, status_code) {
    this.reason = reason;
    this.status_code = status_code;
    this.mongoose = mongoose;
    this.client = client;
    this.channel = this.client.channels.cache.get("904421522205204531");
    this.MessageEmbed = MessageEmbed;

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

    this.ClosingEmbed = new this.MessageEmbed()
      .setColor(colors.orange)
      .setTitle("Process exiting")
      .setDescription(`This process is exiting due to "${this.reason}".`)
      .setTimestamp();

    setTimeout(() => {
      console.log("Closing process...");
      setTimeout(async () => {
        this.channel.send({
          embeds: [this.ClosingEmbed],
        });
        this.client.destroy();
        console.log(
          "Discord client destroyed, still trying to close the process..."
        );
        await this.mongoose.connection.close(() =>
          console.log("Mongoose connection closed cleanly.")
        );
        setTimeout(() => {
          console.log(
            `This process has been closed for reason ${this.reason}.`
          );
          return process.exit(this.status_code);
        }, 4500);
      }, 5000);
    }, 3500);
  }
};
