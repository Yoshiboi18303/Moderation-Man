module.exports = class CloseProcess {
  constructor(reason) {
    this.reason = reason;
    this.mongoose = mongoose;
    this.client = client;
    this.channel = this.client.channels.cache.get("904421522205204531");
    this.MessageEmbed = MessageEmbed;
    this.emojis = emojis;
    this.colors = colors;

    this.ClosingEmbed = new this.MessageEmbed()
      .setColor(this.colors.orange)
      .setTitle("Process Exiting")
      .setDescription(
        `${this.emojis.exit} **-** This process is exiting due to "${this.reason}"...`
      )
      .setTimestamp();

    if (!this.reason)
      throw new Error("This class needs a reason for the closed process!");
    if (typeof this.reason != "string")
      throw new Error(
        `Expected reason type to be a type of string, got ${typeof this
          .reason} instead.`
      );
    if (this.reason == " " || this.reason.length <= 0)
      throw new Error("The closing reason can't be an empty string!");

    this.channel.send({
      embeds: [this.ClosingEmbed],
    });

    var name_text = "MODERATION-MAN:".blue;

    setTimeout(() => {
      console.log(`${name_text} Closing process...`);
      setTimeout(async () => {
        this.client.destroy();
        console.log(
          `${name_text} Discord client destroyed, still trying to close the process...`
        );
        await this.mongoose.connection.close(() =>
          console.log(`${name_text} Mongoose connection closed cleanly.`)
        );
        setTimeout(() => {
          console.log(
            `${name_text} This process has been closed for reason ${this.reason}.`
          );
          return process.exit();
        }, 4500);
      }, 5000);
    }, 3500);
  }
};
