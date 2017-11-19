//Dependencies
const fs = require("fs");
const express = require("express");
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const socketio = require("socket.io");
global.chalk = require("chalk");
//const moment = require("moment")
//load in config from .env file
require("dotenv").config()
const port = process.env.PORT || process.env.USER_PORT || 3000;
const mongouri = process.env.MONGODB_URI;
//Load terms
global.terms = JSON.parse(fs.readFileSync("terms.json"));
terms = terms.reduce(function(termdict, terminfo){
  termdict[terminfo.id] = terminfo
  return termdict
}, {})
//Setting up server
var app = express();
httpserver = app.listen(port, () => {
  console.log("App is"+chalk.green(" running ")+"at http://localhost:%d", port);
  console.log("Press CTRL-C to stop\n");
});
//Setting up sockets
global.io = socketio(httpserver)
//Prepping server logic
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
//Sets the template engine to be handlebars
var hbs = exphbs.create({defaultLayout: 'base'})
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
//Create routers
global.router = express.Router();
global.api_router = express.Router();
//Serves all files in the res folder as static resources
app.use('/res', express.static('res'));
app.use("/", router);
app.use("/api", api_router);
require("./routers/routers");
module.exports = app;
