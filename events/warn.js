module.exports = {
  name: "warn",
  async execute(info) {
    var warning_text = "WARNING:".yellow;
    console.warn(`${warning_text}\n${info}`);
  },
};
