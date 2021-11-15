module.exports = class CloseProcess {
  constructor(reason, status_code) {
    this.reason = reason;
    this.status_code = status_code;
    this.mongoose = mongoose;
    this.client = client;
    this.channel = this.client.channels.cache.get("904421522205204531");
    this.MessageEmbed = MessageEmbed;
    this.emojis = emojis;

    if (!this.reason)
      throw new Error("This class needs a reason for the closed process!");
    if (!this.status_code)
      throw new Error("This class needs a status code for the closed process!");
    if (typeof this.reason != "string")
      throw new Error(
        `Expected reason type to be a type of string, got ${typeof this
          .reason} instead.`
      );
    if (typeof this.status_code != "number")
      throw new Error(
        `Expected status code to be a type of number, got ${typeof this
          .status_code} instead.`
      );

    this.ClosingEmbed = new this.MessageEmbed()
      .setColor(colors.orange)
      .setTitle("Process Exiting")
      .setDescription(
        `${this.emojis.exit} **-** This process is exiting due to "${this.reason}"...`
      )
      .setTimestamp();

    this.channel.send({
      embeds: [this.ClosingEmbed],
    });

    var name_text = "MODERATION-MAN:".blue;

    setTimeout(() => {
      console.log(`${name_text} Closing process...`);
      setTimeout(async () => {
        try {
          this.client.destroy();
          console.log(
            `${name_text} Discord client destroyed, still trying to close the process...`
          );
        } catch (e) {
          console.error(e);
          await this.mongoose.connection.close(() =>
            console.log(`${name_text} Mongoose connection closed cleanly.`)
          );
          setTimeout(() => {
            console.log(
              `${name_text} This process has been closed for reason ${this.reason}.`
            );
            return process.exit(this.status_code);
          }, 4500);
        }
      }, 5000);
    }, 3500);
  }
};
