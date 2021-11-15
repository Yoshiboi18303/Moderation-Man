const DebugLog = require("../items/classes/Debug");

module.exports = {
  name: "debug",
  once: false,
  execute(info) {
    new DebugLog(info);
  },
};
