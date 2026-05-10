const Product = require("../models/Product");

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      stock = 0,
      vatApplicable = true,
      category = "General",
      serialNumber = "",
      warrantyMonths = 0
    } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    if (Number(price) < 0 || Number(stock) < 0 || Number(warrantyMonths) < 0) {
      return res.status(400).json({ message: "Invalid price or stock" });
    }

    const product = await Product.create({
      name,
      price: Number(price),
      stock: Number(stock),
      vatApplicable: Boolean(vatApplicable),
      category,
      serialNumber,
      warrantyMonths: Number(warrantyMonths) || 0
    });

    res.status(201).json(product);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE PRODUCT
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    if (req.body.price != null && Number(req.body.price) < 0) {
      return res.status(400).json({ message: "Invalid price" });
    }

    if (req.body.stock != null && Number(req.body.stock) < 0) {
      return res.status(400).json({ message: "Invalid stock" });
    }

    if (req.body.warrantyMonths != null && Number(req.body.warrantyMonths) < 0) {
      return res.status(400).json({ message: "Invalid warranty period" });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
