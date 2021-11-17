const mongo = require("./mongo");

(async () => {
  console.log("Setting up MongoDB...");
  await mongo(process.env.MONGO_CS);
})();
