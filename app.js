require("dotenv").config();

var express = require("express");
var app = express();
var db = require("./db");
var user = require("./controllers/usercontroller");
var game = require("./controllers/gamecontroller");

const port = 4000;

db.sync();

app.use(express.json());
app.use("/api/auth", user);
app.use("/api/game", game);
app.listen(port, function () {
  console.log(`App is listening on ${port}`);
});
