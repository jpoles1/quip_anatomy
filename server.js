//Dependencies
const express = require("express");
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const socketio = require("socket.io");
const chalk = require("chalk");
//const moment = require("moment")
//load in config from .env file
require("dotenv").config()
const port = process.env.PORT || process.env.USER_PORT || 3000;
//Setting up server
var app = express();
httpserver = app.listen(port, () => {
  console.log("App is"+chalk.green(" running ")+"at http://localhost:%d", port);
  console.log("Press CTRL-C to stop\n");
});
//Setting up sockets
const io = socketio(httpserver)
io.on("connect", ()=>{
  console.log(chalk.yellow("New Client Connected!"))
})

//Prepping server logic

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
//Sets the template engine to be handlebars
var hbs = exphbs.create({defaultLayout: 'base'})
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
//Serves all files in the res folder as static resources
global.router = express.Router();
global.api_router = express.Router();
app.use('/res', express.static('res'));
app.use("/", router);
app.use("/api", api_router);
require("./routers/routers")
module.exports = app;
