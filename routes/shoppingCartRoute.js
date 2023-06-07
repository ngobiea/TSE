const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const authenticate = require("../middlewares/auth");


router.post("/setItemDetails",authenticate.verifyUser, async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    req.session.isLoggedIn = true;
    req.session.user = req.body.userId;

    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error("Could not find product.");
      error.statusCode = 404;
      throw error;
    }
    if (product.status === "promotion") {
      if (product.quantity < quantity) {
        const error = new Error("Not enough quantity in stock!");
        error.statusCode = 403;
        throw error;
      }
      product.price = product.price * 0.8;
    }

    const Item = {
      productId: product._id,
      title: product.title,
      description: product.description,
      color: product.color,
      quantity: product.quantity,
      price: product.price,
      quantityInHand: quantity,
    };
    req.session.item = Item;
    const sessionId = req.session.id;
    res.status(200).json({ message: "Product added to cart!", sessionId });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
});

module.exports = router;
