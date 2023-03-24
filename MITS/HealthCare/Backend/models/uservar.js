const mongoose = require("mongoose");

const uservarSchema = new mongoose.Schema({
  email: { type: String, required: true, trim: true },
  otp: { type: Number, required: true },
});

const userVarifictionModel = mongoose.model("userVarifiction", uservarSchema);
module.exports = userVarifictionModel;
