const mongodb = require("mongodb")
global.chalk = require("chalk");
const fs = require("fs");
require("dotenv").config()
const mongouri = process.env.MONGODB_URI;
//Connect to DB
MongoClient = mongodb.MongoClient
MongoClient.connect(mongouri, function(err, mdb) {
  if (err) throw err;
  console.log(chalk.green("Connected to DB"));
  console.log(chalk.yellow("Reading DB"));
  mdb.collection("answers").deleteMany({"session_key": "Auto-Populated"}, function(err, obj) {
    if (err) throw err;
    console.log(chalk.green("Finished!"));
    console.log(obj.result.n + " document(s) deleted");
    mdb.close();
  });
});
