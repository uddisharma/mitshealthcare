// import dotenv from "dotenv";
const dotenv = require("dotenv");
dotenv.config();
// import express from "express";
const express = require("express");
// import path from "path";
const path = require("path");
// import cors from "cors";
const cors = require("cors");
// import connectDB from "./config/connectdb.js";
const connectDB = require("./config/connectdb.js");
// import userRoutes from "./routes/userRoutes.js";
const userRoutes = require("./routes/userRoutes.js");
// import cardRoutes from "./routes/cardRoutes.js";
const cardRoutes = require("./routes/cardRoutes.js");
// import adminRoute from "./routes/adminRoutes.js";
const adminRoute = require("./routes/adminRoutes.js");
const contactRoute = require("./routes/contactRoutes.js");
const orderRoute = require("./routes/OrderRoute.js");
const userVarRoute = require("./routes/uservarRoutes.js");
// import "./controllers/passport.js";
require("./controllers/passport.js");
// import session from "express-session";
const session = require("express-session");
// import passport from "passport";
const passport = require("passport");
const app = express();
const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
app.use(express.static(path.join(__dirname, "build")));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// app.use(
//   cors({
//     origin: ["http://localhost:8000"],
//   })
// );
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

connectDB(DATABASE_URL);

app.use(express.json());
app.use("/", userVarRoute);
app.use("/", userRoutes);
app.use("/", adminRoute);
app.use("/", cardRoutes);
app.use("/", contactRoute);
app.use("/", orderRoute);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
