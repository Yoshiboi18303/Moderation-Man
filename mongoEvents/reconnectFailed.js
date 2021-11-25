module.exports = {
  name: "reconnectFailed",
  once: false,
  execute() {
    const error_text = "MONGODB-ERROR".red;
    console.log(
      `${error_text} The MongoDB reconnection has failed due to running out of tries.`
    );
  },
};
