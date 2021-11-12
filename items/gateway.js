const { Gateway } = require("@spectacles/gateway");
const gateway = new Gateway(process.env.TOKEN)

module.exports = gateway