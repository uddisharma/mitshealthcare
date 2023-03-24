// import mongoose from "mongoose";
const mongoose = require("mongoose");
// Defining Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  tc: { type: Boolean },
  otp: { type: Number },
});

// Model
const UserModel = mongoose.model("user", userSchema);

// export default UserModel;
module.exports = UserModel;
