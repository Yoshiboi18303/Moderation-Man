const mongoose = require("mongoose");

module.exports = async (connectionString) => {
  await mongoose.connect(connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    connectTimeoutMS: 120000,
  });
};
