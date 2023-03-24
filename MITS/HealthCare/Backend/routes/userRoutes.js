// import express from "express";
const express = require("express");
const router = express.Router();
// import UserController from "../controllers/userController.js";
const UserController = require("../controllers/userController.js");
// import checkUserAuth from "../middlewares/auth-middleware.js";
const checkUserAuth = require("../middlewares/auth-middleware.js");

router.use("/changepassword", checkUserAuth);
router.use("/loggeduser", checkUserAuth);

router.post("/register", UserController.userRegistration);
router.get("/users", UserController.AllUsers);
router.delete("/user/delete/:id", UserController.DeleteUser);
router.post("/verify/:username", UserController.Verify);
router.patch("/resend/:username", UserController.Resend);
router.post("/login", UserController.userLogin);
router.post(
  "/send-reset-password-email",
  UserController.sendUserPasswordResetEmail
);
router.post("/forget-password/:username", UserController.ForgetPassword);
router.post("/reset-password/:id/:token", UserController.userPasswordReset);
router.post("/userprofile/:username", UserController.getUserProfile);

// Protected Routes
router.post("/changepassword", UserController.changeUserPassword);
router.get("/profile", UserController.loggedUser);

// export default router;
module.exports = router;
