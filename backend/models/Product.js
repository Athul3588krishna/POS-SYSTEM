const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  stock: {
    type: Number,
    default: 0,
    min: 0
  },

  category: {
    type: String,
    default: "General"
  },

  vatApplicable: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);