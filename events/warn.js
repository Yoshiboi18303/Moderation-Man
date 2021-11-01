module.exports = {
  name: "warn",
  async execute(info) {
    console.warn(`WARNING:\n${info}`);
  },
};
