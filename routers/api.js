const crypto = require('crypto');

var generate_key = function() {
    var sha = crypto.createHash('sha256');
    sha.update(Math.random().toString());
    return sha.digest('hex');
};

api_router.get("/newsession", (req, res) => {
  res.send("Created new session with key " + generate_key())
})
