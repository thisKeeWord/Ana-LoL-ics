var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var staticData = {
  created_at: { type: Number, required: true },
  static: { type: Object, required: true }
};

module.exports = mongoose.model('StaticData', staticData);
