const express = require("express");
const Product = require("../models/productModel");
// const User = require("../models/userModel");
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const passport = require("passport");
const authenticate = require("../middlewares/auth");

const router = express.Router();





router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    User.register(new User({ name, email }), password, (err, user) => {
      if (err) {
        console.log(err)
        res.status(500).json({ error: "Error registering new user" });
      } else {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.json({ token });
      }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});
router.post("/login", async (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      try {
        if (err || !user) {
          // Authentication failed
          return res.status(401).json({ error: "Authentication failed" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.status(200).json({ token,userId:user._id });
      } catch (err) {
        next(err);
      }
    }
  )(req, res, next);
});
router.post("/product",passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { title, price, description, quantity, color, userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("Invalid user Id");
      error.statusCode = 401;
      throw error;
    }
    const product = new Product({
      title,
      price,
      description,
      quantity,
      color,
      userId,
    });
    await product.save();
    user.products.push(product);
    await user.save();

    res.status(201).json({
      status: "success adding a new product",
      product,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});
router.get("/products/:userId",authenticate.verifyUser, async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate("products");
    res.status(200).json({
      status: "success",
      products: user.products,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
});
router.get("/product/:productId",authenticate.verifyUser, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
});
router.put("/product/:productId",authenticate.verifyUser, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { title, price, description, quantity, userId, status, color } =
      req.body;

    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error("Could not find product.");
      error.statusCode = 404;
      throw error;
    }
    if (product.userId.toString() !== userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }
    if (title) {
      product.title = title;
    }
    if (price) {
      product.price = price;
    }
    if (description) {
      product.description = description;
    }
    if (quantity) {
      product.quantity = quantity;
    }
    if (status) {
      product.status = status;
    }
    if (color) {
      product.color = color;
    }
    await product.save();
    res.status(200).json({ message: "Product updated!", product });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
});
router.patch("/product/:productId",authenticate.verifyUser, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { title, price, description, quantity, userId, status, color } =
      req.body;
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error("Could not find product.");
      error.statusCode = 404;
      throw error;
    }
    if (product.userId.toString() !== userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }
    if (title) {
      product.title = title;
    }
    if (price) {
      product.price = price;
    }
    if (description) {
      product.description = description;
    }
    if (quantity) {
      product.quantity = quantity;
    }
    if (status) {
      product.status = status;
    }
    if (color) {
      product.color = color;
    }
    await product.save();
    res.status(200).json({ message: "Product updated!", product });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
});
router.delete("/product/:productId",authenticate.verifyUser, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error("Could not find product.");
      error.statusCode = 404;
      throw error;
    }
    const userId = product.userId.toString();
    await Product.findByIdAndDelete(productId);
    const user = await User.findById(userId);
    user.products.pull(productId);
    await user.save();
    res.status(200).json({ message: "Product deleted!" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
});

module.exports = router;
