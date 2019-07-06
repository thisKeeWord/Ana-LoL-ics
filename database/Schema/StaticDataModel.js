var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var staticDataModel = {
  created_at: { type: Number, required: true },
  static: { type: Object }
};

module.exports = mongoose.model("StaticDataModel", staticDataModel);
