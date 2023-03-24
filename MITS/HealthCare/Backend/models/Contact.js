// import mongoose from "mongoose";
const mongoose = require("mongoose");
const Contact = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
  },
  company: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },
});

const ContactModel = new mongoose.model("Contact", Contact);
// export default CardModel;
module.exports = ContactModel;
