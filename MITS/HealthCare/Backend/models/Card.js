// import mongoose from "mongoose";
const mongoose = require("mongoose");
const makeCard = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
  },
  particular: {
    type: String,
  },
  composition: {
    type: String,
    required: true,
  },
  mrp: {
    type: Number,
    required: true,
  },

  rate: {
    type: Number,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
});

const CardModel = new mongoose.model("Product", makeCard);
// export default CardModel;
module.exports = CardModel;
