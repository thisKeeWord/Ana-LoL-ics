var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var throttleCalls = {
  created_at: { type: Number, required: true }
};

module.exports = mongoose.model('ThrottleCalls', throttleCalls);
