const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
  vatApplicable: { type: Boolean, default: true }
});

module.exports = mongoose.model("Product", productSchema);