// import CardModel from "../models/Card.js";
const CardModel = require("../models/Card.js");

// import adminModal from "../models/admin.js";
const nodemailer = require("nodemailer");
// import Mailgen from "mailgen";
const Mailgen = require("mailgen");
const AdminModal = require("../models/admin.js");
// import bcrypt from "bcrypt";
const bcrypt = require("bcrypt");
// import jwt from "jsonwebtoken";
const jwt = require("jsonwebtoken");
// import UserModel from "../models/User.js";
const UserModel = require("../models/User.js");
const sendAdminDetail = (req, res, password) => {
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
      name: "Hey Admin",
      intro: "Your Password ",
      table: {
        data: [
          {
            description:
              "Hii admin you have forgot your password. so don't worry about it . We must take care of our admin your password had saved into our database. Here is your password" +
              "   " +
              password +
              "   " +
              "please keep it safe don't share it with anyone",
          },
        ],
      },
      outro: "Thanks from MITS Spectra",
    },
  };
  let mail = maingenerator.generate(response);
  let message = {
    from: "uddibhardwaj08@gmail.com",
    to: "uddibhardwaj2001@gmail.com",
    subject: "Your Forgotten password is here",
    html: mail,
  };
  transporter
    .sendMail(message)
    .then(() => {
      return res.status(200).json({
        msg: "Emal has been sent successfully",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        error: err.message,
      });
    });
};
const SendEmail = (desc, sub, req, res) => {
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
      name: "uddibhardwaj2001@gmail.com",
      intro: "you have received an email from MITS Spectra ",
      table: {
        data: [
          {
            description: desc,
          },
        ],
      },
      outro: "Thanks from MITS Spectra",
    },
  };
  let mail = maingenerator.generate(response);
  let message = {
    from: "uddibhardwaj08@gmail.com",
    to: "uddibhardwaj2001@gmail.com",
    subject: sub,
    html: mail,
  };
  transporter
    .sendMail(message)
    .then(() => {
      return res.status(200).json({
        msg: "Emal has been sent successfully",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        error: err.message,
      });
      return;
    });
};
class adminController {
  static Admin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await AdminModal.findOne({ email: email });
        if (user != null) {
          // const isMatch = await bcrypt.compare(password, user.password);
          if (user.email === email && user.password === password) {
            // Generate JWT Token
            const token = jwt.sign(
              { userID: user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "1d" }
            );
            CardModel.find()
              .then((card) => {
                // SendEmail(
                //   "Hey Admin Someone login with Your Credentails as Admin in MITS Speactra. If this is you  can ignore this message if not you have to take some action or you can change your password immidiately  ",
                //   "Admin Login alert",
                //   req,
                //   res
                // );
                res.json({
                  msg: "Login Success",
                  token: token,
                  products: card,
                });
              })
              .catch((error) => {
                res.status(500).send(error.message);
              });
          } else {
            // SendEmail(
            //   "Hey Admin there is someone who try to login with your credentials but he/she filled wrong credentials. We suggest you to please create a strong password ",
            //   "Someone try to login with you credentials",
            //   req,
            //   res
            // );
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
  static ForgotPassword = async (req, res) => {
    const _id = "63f9e3b791240b706e4cb36a";
    try {
      const AdminData = await AdminModal.findById({ _id }).then((data) => {
        // res.json({ data });
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
            name: " Admin",
            intro: "Your Password ",
            table: {
              data: [
                {
                  description:
                    "Hii admin you have forgot your password. so don't worry about it . We must take care of our admin your password had saved into our database. Here is your password" +
                    "   " +
                    data.password +
                    "   " +
                    "please keep it safe don't share it with anyone",
                },
              ],
            },
            outro: "Thanks from MITS Spectra",
          },
        };
        let mail = maingenerator.generate(response);
        let message = {
          from: "uddibhardwaj08@gmail.com",
          to: "uddibhardwaj2001@gmail.com",
          subject: "Your Forgotten password is here",
          html: mail,
        };
        transporter
          .sendMail(message)
          .then(() => {
            return res.status(200).json({
              msg: "Emal has been sent successfully",
            });
          })
          .catch((err) => {
            return res.status(500).json({
              error: err.message,
            });
          });
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
}
// export default adminController;
module.exports = adminController;
