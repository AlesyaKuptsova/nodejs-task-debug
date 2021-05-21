require("dotenv").config();

const express = require("express");
const app = express();
const db = require("./db");
const user = require("./controllers/usercontroller");
const game = require("./controllers/gamecontroller");

const port = 4000;

db.sync();

app.use(express.json());
app.use("/api/auth", user);
app.use("/api/game", game);
app.listen(port, function () {
  console.log(`App is listening on ${port}`);
});
