//Game Logic
global.rand_term = function (session_key) {
  new_term = terms[Object.keys(terms)[Math.floor(Math.random()*Object.keys(terms).length)]]
  while(new_term.id in session_info[session_key]["terms"]){
    new_term = terms[Object.keys(terms)[Math.floor(Math.random()*Object.keys(terms).length)]]
  }
  new_term.term = new_term.term.charAt(0).toUpperCase() + new_term.term.slice(1)
  session_info[session_key]["current_term"] = new_term
  session_info[session_key]["terms"][new_term.id] = {}
};
router.get("/session/:session_key", (req, res) => {
  session_key = req.params.session_key
  if(!(session_key in session_info)){
    res.redirect("/")
    return 0
  }
  res.page_data.session_key = session_key
  res.render("launch.hbs", res.page_data)
})
router.get("/session/:session_key/gameon", (req, res) => {
  res.page_data.layout = undefined
  session_key = req.params.session_key
  session_info[session_key]["started"] = 1;
  if(!(session_key in session_info)){
    res.redirect("/")
    return 0
  }
  res.page_data.session_key = session_key
  /*if(!session_info[session_key]["current_term"]){
    rand_term(session_key)
  }*/
  res.page_data.current_term = session_info[session_key]["current_term"]
  res.page_data.current_term.image_list = res.page_data.current_term.imgurls.split(";")
  res.render("game.hbs", res.page_data)
})
router.get("/session/:session_key/stats", (req, res) => {
  session_key = req.params.session_key
  if(!(session_key in session_info)){
    res.redirect("/")
    return 0
  }
  res.page_data.session_key = session_key
  res.page_data.gamestats = Object.keys(session_info[session_key]["terms"]).reduce(function(stats, termid){
    stats[termid] = Object.keys(session_info[session_key]["terms"][termid]).reduce(function(redict, uname){
      redict.ct = redict.ct + 1
      redict.cumscore = redict.cumscore + parseInt(session_info[session_key]["terms"][termid][uname]["score"])
      return redict
    }, {term: terms[termid]["term"], cumscore: 0, ct: 0})
    stats[termid].score = stats[termid].cumscore / stats[termid].ct
    if(stats[termid].ct < 1){
      stats[termid] = undefined
    }
    return stats
  }, {})
  res.render("stats.hbs", res.page_data)
})
router.get("/session/:session_key/export", (req, res) => {
  session_key = req.params.session_key
  if(!(session_key in session_info)){
    res.redirect("/")
    return 0
  }
  res.page_data.session_key = session_key
  res.page_data.gamestats = Object.keys(session_info[session_key]["terms"]).reduce(function(stats, termid){
    stats[termid] = Object.keys(session_info[session_key]["terms"][termid]).reduce(function(redict, uname){
      redict.ct = redict.ct + 1
      redict.cumscore = redict.cumscore + parseInt(session_info[session_key]["terms"][termid][uname]["score"])
      return redict
    }, {term: terms[termid]["term"], cumscore: 0, ct: 0})
    stats[termid].score = stats[termid].cumscore / stats[termid].ct
    if(stats[termid].ct < 1){
      stats[termid] = undefined
    }
    return stats
  }, {})
  res.json(res.page_data)
})
