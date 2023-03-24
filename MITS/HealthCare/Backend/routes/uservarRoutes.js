const express = require("express");
const router = express.Router();
const UserVarController = require("../controllers/uservarcontroller.js");
router.post("/sendotp", UserVarController.uservar);
router.post("/verificaton", UserVarController.otpvarification);
router.patch("/resend", UserVarController.Resend);
module.exports = router;
