const crypto = require('crypto');
global.session_info = {}
var generate_key = function() {
    var sha = crypto.createHash('sha256');
    sha.update(Math.random().toString());
    return sha.digest('hex').substring(0, 8);
};

api_router.get("/newsession", (req, res) => {
  var new_key;
  while(!new_key | new_key in session_info){
    new_key = generate_key()
  }
  session_info[new_key] = {"terms": {}}
  console.log(session_info);
  res.page_data.redir_url = "/session/"+new_key
  res.page_data.redir_msg = "Created new session with key: " + new_key
  res.render("redirect.hbs", res.page_data)
})
