module.exports = {
  name: "error",
  once: false,
  execute(err) {
    new BotError(
      "General Client Error Occurred.",
      err,
      false
    )
  },
};
