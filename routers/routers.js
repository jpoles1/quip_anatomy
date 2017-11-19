router.use((req, res, next) => {
  res.page_data = {layout: "layouts/base"};
  next();
})
router.get("/", (req, res) => {
  res.render("home.hbs", res.page_data)
})

require("./api.js")
require("./game.js")
require("./socket.js")
