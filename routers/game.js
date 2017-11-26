//Game Logic
global.rand_term = function (session_key) {
  new_term = terms[Object.keys(terms)[Math.floor(Math.random()*Object.keys(terms).length)]]
  while(new_term.id in session_info[session_key]["terms"]){
    new_term = terms[Object.keys(terms)[Math.floor(Math.random()*Object.keys(terms).length)]]
  }
  new_term.term = new_term.term.charAt(0).toUpperCase() + new_term.term.slice(1)
  session_info[session_key]["current_term"] = new_term.id
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
//This page is served via AJAX to the quiz screen
router.get("/session/:session_key/gameon", (req, res) => {
  res.page_data.layout = undefined
  session_key = req.params.session_key
  session_info[session_key]["started"] = 1;
  if(!(session_key in session_info)){
    res.redirect("/")
    return 0
  }
  res.page_data.session_key = session_key
  res.page_data.current_term = terms[session_info[session_key]["current_term"]]
  res.page_data.current_term.diagram_list = res.page_data.current_term.diagram_urls.split(";")
  res.page_data.current_term.cadaverimg_list = res.page_data.current_term.cadaverimg_urls.split(";")
  //Fetch other student's notes from the DB
  query = {"tid": parseInt(session_info[session_key]["current_term"])}
  sort = {"votes": -1}
  console.log(query)
  db.collection("answers").find(query).toArray(function(err, results) {
    if (err) throw err;
    console.log(results);
    res.page_data.ed_notes = results.filter(function(x){
      return (x.votes >= -5 && x.notes.trim() != "")
    })

    res.page_data.ed_notes = Object.keys(res.page_data.ed_notes).map(function(x){
      lookup = {"-1": "Don't Know", "0": "Sorta Know", "1": "Definitely Know"}
      x = res.page_data.ed_notes[x]
      x.confidence_txt = lookup[x.score.toString()]
      return x
    })
    //Compile data for barchart
    res.page_data.score_stats = JSON.stringify(results.reduce(function(agg, x){
      agg[x.score.toString()] += 1
      return agg
    }, {"-1": 0, "0": 0, "1": 0}))
    res.render("game.hbs", res.page_data)
  });
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
    }, {lesson: terms[termid]["lesson"], term: terms[termid]["term"], cumscore: 0, ct: 0})
    stats[termid].score = stats[termid].cumscore / stats[termid].ct
    if(stats[termid].ct < 1){
      stats[termid] = undefined
    }
    return stats
  }, {})
  res.render("stats.hbs", res.page_data)
})
router.get("/session/:session_key/export.json", (req, res) => {
  session_key = req.params.session_key
  if(!(session_key in session_info)){
    res.redirect("/")
    return 0
  }
  gamestats = Object.keys(session_info[session_key]["terms"]).reduce(function(stats, termid){
    stats[termid] = Object.keys(session_info[session_key]["terms"][termid]).reduce(function(redict, uname){
      redict.ct = redict.ct + 1
      redict.cumscore = redict.cumscore + parseInt(session_info[session_key]["terms"][termid][uname]["score"])
      return redict
    }, {lesson: terms[termid]["lesson"], term: terms[termid]["term"], cumscore: 0, ct: 0})
    stats[termid].score = stats[termid].cumscore / stats[termid].ct
    if(stats[termid].ct < 1){
      stats[termid] = undefined
    }
    return stats
  }, {})
  Object.keys(gamestats).map(function(termid){
    if(!gamestats[termid]) return;
    gamestats[termid]["notes"] = Object.keys(session_info[session_key]["terms"][termid])
    .map(function(resp){
      resp = session_info[session_key]["terms"][termid][resp]
      if(resp.notes) return resp.notes
    })

  })
  res.json(gamestats)
})
