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
	      productId: {
	        type: mongoose.Schema.Types.ObjectId,
	        ref: "Product"
	      },
		      name: String,
		      qty: Number,
		      rate: Number,
		      serialNumber: String,
		      warrantyMonths: Number,
		      warrantyUntil: Date,
	      vat: Number,
	      total: Number
	    }
  ],

  subtotal: Number,
  vatTotal: Number,
  discount: Number,
  grandTotal: Number,

	  paymentMethod: String
	}, { timestamps: true });

module.exports = mongoose.model("Invoice", invoiceSchema);
