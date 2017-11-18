router.use((req, res, next) => {
  res.page_data = {layout: "layouts/base"};
  next();
})
router.get("/", (req, res) => {
  res.render("home.hbs", res.page_data)
})

//Game Logic
router.use((req, res, next) => {
  res.page_data = {layout: "layouts/base"};
  next();
})
rand_term = function (session_key) {
  new_term = terms[Math.floor(Math.random()*terms.length)]
  while(new_term.id in session_info[session_key]["terms"]){
    new_term = terms[Math.floor(Math.random()*terms.length)]
  }
  console.log(new_term)
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
  session_key = req.params.session_key
  if(!(session_key in session_info)){
    res.redirect("/")
    return 0
  }
  res.page_data.session_key = session_key
  if(!session_info[session_key]["current_term"]){
    rand_term(session_key)
  }
  res.page_data.current_term = session_info[session_key]["current_term"]
  console.log(res.page_data.current_term)
  res.render("game.hbs", res.page_data)
})
require("./api.js")
