const ObjectID = require('mongodb').ObjectID;

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
    term_id = session_info[player.session_key]["current_term"]
    current_term = term = terms[term_id]
    session_info[player.session_key]["terms"][term_id][player.uname] = data
    db.collection("answers").insert({
      "timestamp": new Date(),
      "session_key": player.session_key, "uname": player.uname,
      "tid": term_id, "lesson": current_term.lesson, "term": current_term.term,
      "score": data.score, "notes": data.notes, "votes": 0, "votect": 0
    })
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
  socket.on("vote ednote", function(data){
    console.log("UPDATE NOTE", data)
    o_id = new ObjectID(data.answerid)
    console.log({"_id": o_id})
    db.collection("answers").update({"_id": o_id}, {
      $inc: {"votes": parseInt(data.vote), "votect": 1 }}
    )
  })
  socket.on('disconnect', function (data) {
    player = players[socket.id]
    console.log(chalk.red("Client Disconnected!"), player)
    if (player.added) {
      session_info[player.session_key]["users"][player.uname].active = 0
    }
  });
})
