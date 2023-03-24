// import mongoose from "mongoose";
const mongoose = require("mongoose");
const connectDB = async (DATABASE_URL) => {
  try {
    const DB_OPTIONS = {
      dbName: "visiontrekCards",
    };
    await mongoose.connect(DATABASE_URL, DB_OPTIONS);
    console.log("Connected Successfully...");
  } catch (error) {
    console.log(error);
  }
};

// export default connectDB;
module.exports = connectDB;
