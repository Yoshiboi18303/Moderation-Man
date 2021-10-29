module.exports = {
  name: "error",
  once: false,
  execute(err) {
    console.error(err);
  },
};
