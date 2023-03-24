const CardModel = require("../models/Card.js");
class Cardcontroller {
  static create_product = async (req, res) => {
    const { name, weight, particular, composition, mrp, rate, imgUrl } =
      req.body;
    // if (name && weight && particular && composition && mrp && rate && imgUrl) {
    const card = new CardModel({
      name: name,
      weight: weight,
      particular: particular,
      composition: composition,
      mrp: mrp,
      rate: rate,
      imgUrl: imgUrl,
    });
    await card.save();
    res.send("product is created successfully");
    // } else {
    //   res.send("All fields are required");
    // }
  };
  static update_product = async (req, res) => {
    const _id = req.params.id;
    const { name, weight, particular, composition, mrp, rate, imgUrl } =
      req.body;
    // if (name && weight && particular && composition && mrp && rate && imgUrl) {
    const card = await CardModel.findByIdAndUpdate(_id, {
      $set: {
        name: name,
        weight: weight,
        particular: particular,
        composition: composition,
        mrp: mrp,
        rate: rate,
        imgUrl: imgUrl,
      },
    });
    // await card.save();
    res.send("product is updated successfully");
    // } else {
    //   res.send("All fields are required");
    // }
  };
  static get_products = async (req, res) => {
    try {
      const { particular, name, sort } = req.query;
      const queryobj = {};
      if (particular) {
        queryobj.particular = particular;
      }
      if (name) {
        queryobj.name = name;
      }
      let page = Number(req.query.page);
      let limit = Number(req.query.limit);
      let skip = (page - 1) * limit;
      const api = CardModel.find(queryobj);
      // console.log(req.query.page, req.query.limit);
      // console.log(req.query.sort);

      const AllProducts = await api
        .sort(req.query.sort)
        .skip(skip)
        .limit(limit)
        .then((data) => {
          res.json({ products: data });
        });
    } catch (error) {
      res.status(400).send(error.message || error);
    }
  };
  static get_products_byID = async (req, res) => {
    const _id = req.params.id;
    try {
      const AllProducts = await CardModel.findById({ _id }).then((data) => {
        res.json({ products: data });
      });
    } catch (error) {
      res.status(400).send(error.message || error);
    }
  };
  static FaceWash = async (req, res) => {
    try {
      const AllProducts = await CardModel.find({
        particular: { $in: ["Soap", "Face wash"] },
      }).then((data) => {
        res.json({ products: data });
      });
    } catch (error) {
      res.status(400).send(error.message || error);
    }
  };
  static Creams = async (req, res) => {
    try {
      const AllProducts = await CardModel.find({
        particular: { $in: ["Cream", "Lotion"] },
      }).then((data) => {
        res.json({ products: data });
      });
    } catch (error) {
      res.status(400).send(error.message || error);
    }
  };
  static Tablets = async (req, res) => {
    try {
      const AllProducts = await CardModel.find({
        particular: { $in: ["Tablets", "Capsules"] },
      }).then((data) => {
        res.json({ products: data });
      });
    } catch (error) {
      res.status(400).send(error.message || error);
    }
  };
  static Delete = async (req, res) => {
    const _id = req.params.id;
    try {
      const AllProducts = await CardModel.findByIdAndDelete({ _id }).then(
        (data) => {
          res.json({ msg: "Deleted Successfully", products: data });
        }
      );
    } catch (error) {
      res.status(400).send(error.message || error);
    }
  };
}
// export default Cardcontroller;
module.exports = Cardcontroller;
