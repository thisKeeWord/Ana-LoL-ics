const mongoose = require("mongoose");

const throttleCalls = {
  created_at: { type: Number, required: true },
  whatToSave: { type: String, required: true },
};

module.exports = mongoose.model("ThrottleCalls", throttleCalls);
