// import ContactModel from "../models/Contact.js";
const ContactModel = require("../models/Contact.js");
class ContactController {
  static SendDetails = async (req, res) => {
    try {
      const { firstname, lastname, company, email, phone, message } = req.body;
      if (firstname && lastname && company && email && phone && message) {
        const details = new ContactModel({
          firstname: firstname,
          lastname: lastname,
          company: company,
          email: email,
          phone: phone,
          message: message,
          payment: true,
        });
        await details.save();
        res.send(
          "your details have been saved we we will connect you as soon as possible"
        );
      } else {
        res.send("All fields are required");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  static getDetails = async (req, res) => {
    try {
      const details = await ContactModel.find()
        .then((data) => {
          res.status(200).send(data);
        })
        .catch((err) => res.status(500).send(err.message));
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
}
module.exports = ContactController;
