// import mongoose from "mongoose";
const mongoose = require("mongoose");
const Order = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
  },
  phone: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zip: {
    type: Number,
    required: true,
  },
  order: {
    type: String,
    required: true,
  },
  payment: {
    type: Boolean,
  },
  status: {
    type: String,
    required: true,
  },
});

const OrderModel = new mongoose.model("Order", Order);
// export default CardModel;
module.exports = OrderModel;
