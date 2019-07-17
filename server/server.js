let dotenv = require("dotenv").config({ path: "config.env" });
let express = require("express");
let app = express();
let path = require("path");
let mongoose = require("mongoose");
let bodyParser = require("body-parser");
let fallback = require("express-history-api-fallback");
let controller = require("./../Controller/controler.js");
let seasonStats = require("./../Controller/leagueHistoryController.js");
let mongoURI = "mongodb://lkee:" + process.env.stuff4 + "@ds011439.mlab.com:11439/heroku_wk47xfd5";
mongoose.connect(mongoURI);

app.set("port", process.env.PORT || 5000);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "./../client/")));
app.use("/bower_components", express.static(path.join(__dirname + "./../bower_components")));
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
  console.log("Node app is running on port", app.get("port"));
});
