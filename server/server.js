// eslint-disable-next-line no-unused-vars
const dotenv = require("dotenv").config({ path: "config.env" });
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fallback = require("express-history-api-fallback");
const controller = require("./../Controller/controler.js");
const mongoURI =
  "mongodb://lkee:" + process.env.stuff4 + "@ds011439.mlab.com:11439/heroku_wk47xfd5";
mongoose.connect(mongoURI, { useNewUrlParser: true });

app.set("port", process.env.PORT || 6000);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "./../client/")));
// eslint-disable-next-line no-undef
app.use("/bower_components", express.static(path.join(__dirname + "./../bower_components")));
// eslint-disable-next-line no-undef
app.use(fallback("index.html", { root: __dirname + "./../client/" }));

app.get("/", function(req, res) {
  res.sendFile("index.html");
});

app.get("/riot.txt", function(req, res) {
  res.sendFile("riot.txt");
});

app.post("/", controller.userInformation, controller.matchList);

app.post("/getGameData", controller.getData);

app.listen(app.get("port"), function() {
  // eslint-disable-next-line no-console
  console.log("Node app is running on port", app.get("port"));
});
