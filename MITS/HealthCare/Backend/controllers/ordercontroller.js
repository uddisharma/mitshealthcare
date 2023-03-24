const OrderModel = require("../models/order.js");
const nodemailer = require("nodemailer");
// import Mailgen from "mailgen";
const Mailgen = require("mailgen");
class orderController {
  static SendOrders = async (req, res) => {
    const {
      firstname,
      lastname,
      phone,
      email,
      street,
      city,
      state,
      zip,
      order,
    } = req.body;
    if (
      firstname &&
      lastname &&
      phone &&
      email &&
      street &&
      city &&
      state &&
      zip &&
      order
    ) {
      const orderdetails = new OrderModel({
        firstname: firstname,
        lastname: lastname,
        phone: phone,
        email: email,
        street: street,
        city: city,
        state: state,
        zip: zip,
        order: order,
        payment: true,
        status: "Confirmed",
      });
      await orderdetails.save();
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
          name: firstname + " " + lastname,
          intro: "Order Confimed",
          table: {
            data: [
              {
                description:
                  "Your order has been confirmed. Here is your order id is" +
                  " " +
                  order.slice(9, 24) +
                  " " +
                  "Now you can track your order with this id or you can check status in your profile / your orders",
              },
            ],
          },
          outro: "Thanks from MITS Spectra",
        },
      };
      let mail = maingenerator.generate(response);
      let message = {
        from: "uddibhardwaj08@gmail.com",
        to: email,
        subject: "your order has been confirmed",
        html: mail,
      };
      transporter.sendMail(message).then(() => {
        return res.status(200).json({
          msg: "Email has been sent successfully",
        });
      });
    } else {
      res.send("All fields are required");
    }
  };
  static GetOrders = async (req, res) => {
    try {
      const data = await OrderModel.find().then((orders) => {
        res.status(200).send(orders);
        // console.log(orders.user.order);
      });
    } catch (error) {
      res.status(400).send(error.message || error);
    }
  };
  static UserOrders = async (req, res) => {
    const email = req.params.email;
    try {
      const data = await OrderModel.find({ email }).then((orders) => {
        res.status(200).send(orders);
        // console.log(orders.user.order);
      });
    } catch (error) {
      res.status(400).send(error.message || error);
    }
  };
  static OrderbyId = async (req, res) => {
    const _id = req.params.id;
    try {
      const data = await OrderModel.findById({ _id }).then((orders) => {
        res.status(200).send(orders);
        // console.log(orders.user.order);
      });
    } catch (error) {
      res.status(400).send(error.message || error);
    }
  };
  static UpdateOrder = async (req, res) => {
    try {
      const _id = req.params.id;

      const status = req.body.status;

      const data = await OrderModel.findByIdAndUpdate(_id, {
        $set: {
          status: status,
        },
      }).then((orders) => {
        res.status(200).send(orders);
        // console.log(orders.user.order);
      });
    } catch (error) {
      res.status(400).send(error.message || error);
    }
  };
  static DeleteOrder = async (req, res) => {
    const _id = req.params.id;
    try {
      const data = OrderModel.findByIdAndDelete({ _id })
        .then((data) => {
          res.status(200).send(data);
        })
        .catch((error) => {
          res.status(400).send(error.message || error);
        });
    } catch (error) {
      res.state(400).send(error.message || error);
    }
  };
}
module.exports = orderController;
