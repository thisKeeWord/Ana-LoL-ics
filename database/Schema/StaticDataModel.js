import mongoose from "mongoose";

const staticDataModel = {
  created_at: { type: Number, required: true },
  static: { type: Object },
};

module.exports = mongoose.model("StaticDataModel", staticDataModel);
