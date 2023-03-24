const express = require("express");
const router = express.Router();

const ContactController = require("../controllers/contactcontroller.js");
router.post("/contactus", ContactController.SendDetails);
router.get("/contactus/details", ContactController.getDetails);

module.exports = router;
