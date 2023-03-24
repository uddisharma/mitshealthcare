// import express from "express";
const express = require("express");
// import adminController from "../controllers/admincontroller.js";
const adminController = require("../controllers/admincontroller.js");
const router = express.Router();

// router.post("/adminreg", adminController.adminreg);
router.post("/admin-login", adminController.Admin);
router.get("/admin/forgot-password", adminController.ForgotPassword);
// export default router;
module.exports = router;
