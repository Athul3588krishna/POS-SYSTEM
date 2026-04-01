const Invoice = require("../models/Invoice");
const Product = require("../models/Product");
const { calculateInvoice } = require("../utils/calc");

exports.createInvoice = async (req, res) => {
  try {
    const { items, customer, discount } = req.body;

    // //STOCK VALIDATE CHEYYAL
    for (let item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: `Product not found` });
      }

      if (product.stock < item.qty) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`
        });
      }
    }

    // CALCULATE BILL
    const calc = calculateInvoice(items, discount);

    // STOCK KURAKKUKA
    for (let item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.qty }
      });
    }

    // SAVE INVOICE
    const invoice = await Invoice.create({
      invoiceNumber: "INV-" + Date.now(),
      date: new Date(),
      customer,
      ...calc,
      paymentMethod: "Cash"
    });

    res.json(invoice);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};