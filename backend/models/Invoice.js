const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: String,
  date: Date,

  customer: {
    name: String,
    location: String,
    contact: String,
    trn: String
  },

  items: [
    {
      name: String,
      qty: Number,
      rate: Number,
      vat: Number,
      total: Number
    }
  ],

  subtotal: Number,
  vatTotal: Number,
  discount: Number,
  grandTotal: Number,

  paymentMethod: String
});

module.exports = mongoose.model("Invoice", invoiceSchema);