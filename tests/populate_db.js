const mongodb = require("mongodb")
global.chalk = require("chalk");
const fs = require("fs");
require("dotenv").config()
const mongouri = process.env.MONGODB_URI;
//Load terms
global.terms = JSON.parse(fs.readFileSync("terms.json"));
terms = terms.reduce(function(termdict, terminfo){
  termdict[terminfo.id] = terminfo
  return termdict
}, {})
//Connect to DB
MongoClient = mongodb.MongoClient
MongoClient.connect(mongouri, function(err, mdb) {
  if (err) throw err;
  console.log(chalk.green("Connected to DB"));
  console.log(chalk.yellow("Writing Auto-Entries to DB"));
  for(term_id in terms){
    current_term = terms[term_id]
    mdb.collection("answers").insert({
      "timestamp": new Date(),
      "session_key": "Auto-Populated", "uname": "test-server",
      "tid": parseInt(term_id),
      "lesson": current_term.lesson,
      "term": current_term.term,
      "score": Math.floor(Math.random()+.5),
      "notes": "This is an autopopulated description for the term: "+current_term.term,
      "votes": Math.floor(Math.random()*20)*((Math.floor(Math.random()+.5)*2)-1)
    })
  }
  console.log(chalk.green("Finished writing!"));
  mdb.close()
});
