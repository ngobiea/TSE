const express = require("express");
const Product = require("../models/productModel");
const User = require("../models/userModel");

const router = express.Router();
router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("A user with this email already exists");
      error.statusCode = 409;
      error.type = "email";
      throw error;
    }
    const user = new User({
      name,
      email,
      password,
    });
    const newUser = await user.save();
    res.status(201).json({ message: "Success Creating user", user: newUser });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});
router.post("/product", async (req, res, next) => {
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
router.get("/products/:userId", async (req, res, next) => {
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
router.get("/product/:productId", async (req, res, next) => {
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
router.put("/product/:productId", async (req, res, next) => {
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
router.patch("/product/:productId", async (req, res, next) => {
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
router.delete("/product/:productId", async (req, res, next) => {
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
