players = {}
io.on("connection", (socket)=>{
  console.log(chalk.yellow("New Client Connected!"))
  players[socket.id] = {added: 0}
  socket.on('registration', function (data) {
    player = players[socket.id]
    if (player.added) return;
    player.uname = data.uname
    if(!player.uname || player.uname == ""){
      socket.emit("errormsg", "Invalid Username!")
      return;
    }
    player.session_key = data.session_key
    if(player.uname in session_info[player.session_key]["users"]){
      if(session_info[player.session_key]["users"][player.uname].active){
        socket.emit("errormsg", "Username already taken!")
        return;
      }
    }
    player.added = 1
    socket.join(player.session_key)
    session_info[player.session_key]["users"][player.uname] = {active: 1}
    io.in(player.session_key).emit('new player', session_info[player.session_key]["users"]);
  });
  socket.on("ready", function(){
    player = players[socket.id]
    session_info[player.session_key]["users"][player.uname]["ready"] = session_info[player.session_key]["users"][player.uname]["ready"] ? 0 : 1;
    io.in(player.session_key).emit('new player', session_info[player.session_key]["users"]);
    console.log(session_info[player.session_key]["users"])
    for(uname in session_info[player.session_key]["users"]){
      if(!session_info[player.session_key]["users"][uname]["ready"] && session_info[player.session_key]["users"][uname]["active"]){
        return;
      }
    }
    if(!session_info[player.session_key]["current_term"]){
      rand_term(player.session_key)
    }
    console.log(player.session_key+"... Game on!")
    io.in(player.session_key).emit("game on")
  })
  socket.on("answer", function(data){
    player = players[socket.id]
    term_id = session_info[player.session_key]["current_term"]["id"]
    session_info[player.session_key]["terms"][term_id][player.uname] = data
    io.in(player.session_key).emit("new answer", data)
    for(uname in session_info[player.session_key]["users"]){
      if(!session_info[player.session_key]["terms"][term_id][uname] && session_info[player.session_key]["users"][uname].active){
        return;
      }
    }
    rand_term(player.session_key)
    console.log(player.session_key+"... Next term!")
    io.in(player.session_key).emit("next term")
  })
  socket.on('disconnect', function (data) {
    player = players[socket.id]
    console.log(chalk.red("Client Disconnected!"), player)
    if (player.added) {
      session_info[player.session_key]["users"][player.uname].active = 0
    }
  });

})
