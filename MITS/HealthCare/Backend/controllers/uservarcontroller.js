const userVarifictionModel = require("../models/uservar.js");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
var OTP = Math.floor(1000 + Math.random() * 9000);
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
      name: "MITS Spectra",
      link: "https://mailgen.js/",
    },
  });
  let response = {
    body: {
      name: user,
      intro: "you have received an email from MITS Spectra ",
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
    subject: "OTP for registration on MITS Spectra",
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
class UserVarController {
  static uservar = async (req, res) => {
    const email = req.body.email;
    const user = await userVarifictionModel.findOne({ email: email });
    if (user) {
      res.status(400).send({ status: "failed", message: "Already sent OTP" });
    } else {
      try {
        const data = new userVarifictionModel({
          email: email,
          otp: OTP,
        });
        await data.save();
        // res.send("otp send");
        sendOTP(req, res, email);
      } catch (error) {
        res.status(500).send(error.message || error);
      }
    }
  };
  static otpvarification = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    try {
      const Data = await userVarifictionModel
        .find({ email: email })
        .then((data) => {
          if (data[0].otp == otp) {
            res.status(200).send("OTP has been verfied successfully");
          } else {
            res.status(500).send("OTP is wrong. Please try again");
          }
        })
        .catch((error) => {
          res.status(500).send(error);
        });
    } catch (error) {
      res.status(500).send(error.message || error);
    }
  };
  static Resend = async (req, res) => {
    var email = req.body.email;

    try {
      var findUpdate = await userVarifictionModel.findOneAndUpdate(
        { email: email },
        { $set: { otp: OTP } }
      );

      if (findUpdate) {
        sendOTP(req, res, email);
      } else {
        res.send({ status: "Not found", message: "User not found" });
      }
    } catch (error) {
      res.status(400).send(error);
    }
  };
}
module.exports = UserVarController;
