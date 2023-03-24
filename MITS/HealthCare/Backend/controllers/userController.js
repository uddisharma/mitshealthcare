// import UserModel from "../models/User.js";
const UserModel = require("../models/User.js");
// import bcrypt from "bcrypt";
const bcrypt = require("bcrypt");
// import session from "express-session";
const session = require("express-session");
// import passport from "passport";
const passport = require("passport");
// import nodemailer from "nodemailer";
const nodemailer = require("nodemailer");
// import Mailgen from "mailgen";
const Mailgen = require("mailgen");
// import jwt from "jsonwebtoken";
const jwt = require("jsonwebtoken");
// import transporter from "../config/emailConfig.js";
const transports = require("../config/emailConfig.js");
// import "./passport.js"
require("./passport.js");
var OTP = Math.floor(1000 + Math.random() * 9000);
const SendEmail = (req, res, link, email) => {
  let config = {
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  };
  let transporter = nodemailer.createTransport(config);
  let maingenerator = new Mailgen({
    theme: "default",
    product: {
      name: "VisionTrek",
      link: "https://mailgen.js/",
    },
  });
  let response = {
    body: {
      name: email,
      intro: "you have received an email from VisionTrek ",
      table: {
        data: [
          {
            description: "Your password reset link is" + link,
          },
        ],
      },
      outro: "Valid for 15 mints",
    },
  };
  let mail = maingenerator.generate(response);
  let message = {
    from: "uddibhardwaj08@gmail.com",
    to: email,
    subject: "Password Reset Link",
    html: mail,
  };
  transporter
    .sendMail(message)
    .then(() => {
      return res.status(200).json({
        msg: "Password Reset Link sent successfully",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        error: err.message,
      });
    });
};
const sendOTP = (req, res, user) => {
  let config = {
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  };
  let transporter = nodemailer.createTransport(config);
  let maingenerator = new Mailgen({
    theme: "default",
    product: {
      name: "VisionTrek",
      link: "https://mailgen.js/",
    },
  });
  let response = {
    body: {
      name: user,
      intro: "you have received an email from VisionTrek ",
      table: {
        data: [
          {
            description: "Your OTP for registration " + OTP,
          },
        ],
      },
      outro: "Valid for 15 mints",
    },
  };
  let mail = maingenerator.generate(response);
  let message = {
    from: "uddibhardwaj08@gmail.com",
    to: user,
    subject: "OTP for registration",
    html: mail,
  };
  transporter
    .sendMail(message)
    .then(() => {
      return res.status(200).json({
        msg: "OTP has been sent successfully",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        error: err.message,
      });
    });
};
class UserController {
  static userRegistration = async (req, res) => {
    const { name, lastname, email, password, password_confirmation } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (user) {
      res.send({ status: "failed", message: "Email already exists" });
    } else {
      if (name && lastname && email && password && password_confirmation) {
        if (password === password_confirmation) {
          // sendOTP(req, res, email);
          try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const doc = new UserModel({
              name: name,
              lastname: lastname,
              email: email,
              password: hashPassword,
              // tc: tc,
              otp: OTP,
            });
            await doc.save();
            const saved_user = await UserModel.findOne({ email: email });
            // Generate JWT Token
            const token = jwt.sign(
              { userID: saved_user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "5d" }
            );
            res.status(201).send({
              status: "success",
              message: "Registration Success",
              token: token,
            });
          } catch (error) {
            console.log(error);
            res.send({ status: "failed", message: "Unable to Register" });
          }
        } else {
          res.send({
            status: "failed",
            message: "Password and Confirm Password doesn't match",
          });
        }
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    }
  };
  static ForgetPassword = async (req, res) => {
    const username = req.user.username;
    const finduser = await UserModel.findOne({ email: username });
    let config = {
      service: "gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    };
    let transporter = nodemailer.createTransport(config);
    let maingenerator = new Mailgen({
      theme: "default",
      product: {
        name: "VisionTrek",
        link: "https://mailgen.js/",
      },
    });
    let response = {
      body: {
        name: username,
        intro: "you have received an email from VisionTrek ",
        table: {
          data: [
            {
              description: "Your Password is " + finduser.password,
            },
          ],
        },
        outro: "Your password",
      },
    };
  };
  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await UserModel.findOne({ email: email });
        if (user != null) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (user.email === email && isMatch) {
            // Generate JWT Token
            const token = jwt.sign(
              { userID: user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "5d" }
            );
            res.send({
              status: "success",
              message: "Login Success",
              token: token,
            });
          } else {
            res.send({
              status: "failed",
              message: "Email or Password is not Valid",
            });
          }
        } else {
          res.send({
            status: "failed",
            message: "You are not a Registered User",
          });
        }
      } else {
        res.send({ status: "failed", message: "All Fields are Required" });
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "failed", message: "Unable to Login" });
    }
  };
  static AllUsers = async (req, res) => {
    try {
      const userData = await UserModel.find();
      res.status(200).json({ users: userData, msg: "Success" });
    } catch (error) {
      console.log(error.message);
    }
  };
  static DeleteUser = async (req, res) => {
    const _id = req.params.id;
    try {
      const userData = await UserModel.findByIdAndDelete({ _id });
      res.status(200).json({ users: userData, msg: "Success" });
    } catch (error) {
      console.log(error.message);
    }
  };
  static changeUserPassword = async (req, res) => {
    const { password, password_confirmation } = req.body;
    if (password && password_confirmation) {
      if (password !== password_confirmation) {
        res.send({
          status: "failed",
          message: "New Password and Confirm New Password doesn't match",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(password, salt);
        await UserModel.findByIdAndUpdate(req.user._id, {
          $set: { password: newHashPassword },
        });
        res.send({
          status: "success",
          message: "Password changed succesfully",
        });
      }
    } else {
      res.send({ status: "failed", message: "All Fields are Required" });
    }
  };

  static loggedUser = async (req, res) => {
    res.send({ user: req.user });
  };

  static sendUserPasswordResetEmail = async (req, res) => {
    const { email } = req.body;
    if (email) {
      const user = await UserModel.findOne({ email: email });
      if (user) {
        const secret = user._id + process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ userID: user._id }, secret, {
          expiresIn: "15m",
        });
        const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`;
        console.log(link);
        SendEmail(req, res, link, email);
        res.send({
          status: "success",
          message: "Password Reset Email Sent... Please Check Your Email",
        });
      } else {
        res.send({ status: "failed", message: "Email doesn't exists" });
      }
    } else {
      res.send({ status: "failed", message: "Email Field is Required" });
    }
  };

  static userPasswordReset = async (req, res) => {
    const { password, password_confirmation } = req.body;
    const { id, token } = req.params;
    const user = await UserModel.findById(id);
    const new_secret = user._id + process.env.JWT_SECRET_KEY;
    try {
      jwt.verify(token, new_secret);
      if (password && password_confirmation) {
        if (password !== password_confirmation) {
          res.send({
            status: "failed",
            message: "New Password and Confirm New Password doesn't match",
          });
        } else {
          const salt = await bcrypt.genSalt(10);
          const newHashPassword = await bcrypt.hash(password, salt);
          await UserModel.findByIdAndUpdate(user._id, {
            $set: { password: newHashPassword },
          });
          res.send({
            status: "success",
            message: "Password Reset Successfully",
          });
        }
      } else {
        res.send({ status: "failed", message: "All Fields are Required" });
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "failed", message: "Invalid Token" });
    }
  };

  static getUserProfile = async (req, res) => {
    const username = req.params.username;
    try {
      const userData = await UserModel.findOne({ email: username });
      if (userData) {
        res.send(userData);
      } else {
        res.send("invalid user");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  static Verify = async (req, res) => {
    const username = req.params.username;
    const { otp } = req.body;
    const getuser = await UserModel.findOne({ email: username });
    if (otp == getuser.otp) {
      res.send({ status: "success", message: "OTP successfully verified" });
    } else {
      res
        .status(403)
        .send({ status: "unauthorized", message: "OTP verification failed" });
    }
  };
  static Resend = async (req, res) => {
    var username = req.params.username;
    try {
      var findUpdate = await UserModel.findOneAndUpdate(
        { email: username },
        { $set: { otp: OTP } }
      );
      if (findUpdate) {
        sendOTP(req, res, username);
      } else {
        res.send({ status: "Not found", message: "User not found" });
      }
    } catch (error) {
      res.status(400).send(error);
    }
  };
}

// export default UserController;
module.exports = UserController;
