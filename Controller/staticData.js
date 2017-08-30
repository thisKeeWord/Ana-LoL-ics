var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var staticData = {
  created_at: { type: Number, required: true },
  static: { type: Object, required: true },
  expires: '14d'
};

module.exports = mongoose.model('StaticData', staticData);
