// Clear the Console and require the files
console.clear();

require("./client");

setTimeout(() => require("./db"), 5000);

setTimeout(() => require("./website/app"), 10000);
