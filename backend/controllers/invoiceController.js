const Invoice = require("../models/Invoice");
const Product = require("../models/Product");
const { calculateInvoice } = require("../utils/calc");

const addMonths = (date, months) => {
  const warrantyUntil = new Date(date);
  warrantyUntil.setMonth(warrantyUntil.getMonth() + months);
  return warrantyUntil;
};

exports.createInvoice = async (req, res) => {
  try {
    const { items = [], customer = {}, discount = 0, paymentMethod = "Cash" } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "At least one invoice item is required" });
    }

    const invoiceItems = [];
    const invoiceDate = new Date();

    for (const item of items) {
      const product = await Product.findById(item.productId);
      const qty = Number(item.qty);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (!Number.isFinite(qty) || qty <= 0) {
        return res.status(400).json({ message: `Invalid quantity for ${product.name}` });
      }

      if (product.stock < qty) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`
        });
      }

      invoiceItems.push({
        productId: product._id,
        name: product.name,
        qty,
        rate: product.price,
        serialNumber: product.serialNumber || "",
        warrantyMonths: Number(product.warrantyMonths) || 0,
        warrantyUntil: product.warrantyMonths ? addMonths(invoiceDate, Number(product.warrantyMonths)) : null,
        vatApplicable: product.vatApplicable
      });
    }

    const calc = calculateInvoice(invoiceItems, Number(discount) || 0);

    for (const item of invoiceItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.qty }
      });
    }

    const invoice = await Invoice.create({
      invoiceNumber: "INV-" + Date.now(),
      date: invoiceDate,
      customer,
      ...calc,
      paymentMethod
    });

    res.status(201).json(invoice);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ date: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
