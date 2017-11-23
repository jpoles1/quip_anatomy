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
  mdb.collection("answers").find({
    "tid": {$in: [1, 34 ,122]}
  }).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    console.log(chalk.green("Finished!"));
    mdb.close()
  });
});
