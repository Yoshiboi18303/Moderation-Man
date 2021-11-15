const CP = require("../items/classes/CloseProcess");

module.exports = {
  name: "invalidated",
  once: false,
  execute() {
    new CP("Client session is invalidated.", 1);
  },
};
