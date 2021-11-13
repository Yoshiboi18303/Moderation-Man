const mongo = require("./mongo");

(async () => {
  console.log("Setting up MongoDB...")
  await mongo(process.env.MONGO_CS)
    .then(console.log("MM >>> Connected to MongoDB!\n\n--------------------------------------------------------------\n"))
    .catch((e) => console.error(e));
})()