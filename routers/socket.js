players = {}
io.on("connection", (socket)=>{
  console.log(chalk.yellow("New Client Connected!"))
  players[socket.id] = {added: 0}
  socket.on('registration', function (data) {
    if (players[socket.id].added) return;
    players[socket.id].uname = data.uname
    if(!players[socket.id].uname | players[socket.id].uname == ""){
      socket.emit("errormsg", "Invalid Username!")
      return;
    }
    players[socket.id].session_key = data.session_key
    if(players[socket.id].uname in session_info[players[socket.id].session_key]["users"]){
      if(session_info[players[socket.id].session_key]["users"][players[socket.id].uname].active){
        socket.emit("errormsg", "Username already taken!")
        return;
      }
    }
    players[socket.id].added = 1
    socket.join(players[socket.id].session_key)
    session_info[players[socket.id].session_key]["users"][players[socket.id].uname] = {active: 1}
    io.in(players[socket.id].session_key).emit('new player', session_info[players[socket.id].session_key]["users"]);
  });
  socket.on("ready", function(){
    session_info[players[socket.id].session_key]["users"][players[socket.id].uname]["ready"] = session_info[players[socket.id].session_key]["users"][players[socket.id].uname]["ready"] ? 0 : 1;
    io.in(players[socket.id].session_key).emit('new player', session_info[players[socket.id].session_key]["users"]);
    console.log(session_info[players[socket.id].session_key]["users"])
    for(uname in session_info[players[socket.id].session_key]["users"]){
      if(!session_info[players[socket.id].session_key]["users"][uname]["ready"]){
        return;
      }
    }
    io.in(players[socket.id].session_key).emit("gameon")
  })
  socket.on('disconnect', function (data) {
    console.log(chalk.red("Client Disconnected!"), players[socket.id])
    if (players[socket.id].added) {
      session_info[players[socket.id].session_key]["users"][players[socket.id].uname].active = 0
    }
  });

})
