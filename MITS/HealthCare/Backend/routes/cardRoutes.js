// import express from "express";
const express = require("express");
const router = express.Router();
// import Cardcontroller from "../controllers/cardcontroller.js";
const Cardcontroller = require("../controllers/cardcontroller.js");
router.post("/create-product", Cardcontroller.create_product);
router.get("/products", Cardcontroller.get_products);
router.get("/product/:id", Cardcontroller.get_products_byID);
router.get("/products/facewash&soap", Cardcontroller.FaceWash);
router.get("/products/creams&lotion", Cardcontroller.Creams);
router.get("/products/tablets&capsules", Cardcontroller.Tablets);
router.delete("/product/delete/:id", Cardcontroller.Delete);
router.put("/product/update/:id", Cardcontroller.update_product);
// export default router
module.exports = router;
