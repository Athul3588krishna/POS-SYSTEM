const Invoice = require("../models/Invoice");
const { calculateInvoice } = require("../utils/calc");

exports.createInvoice = async (req, res) => {
  const { items, customer, discount } = req.body;

  const calc = calculateInvoice(items, discount);

  const invoice = await Invoice.create({
    invoiceNumber: "INV-" + Date.now(),
    date: new Date(),
    customer,
    ...calc,
    paymentMethod: "Cash"
  });

  res.json(invoice);
};

exports.getInvoices = async (req, res) => {
  res.json(await Invoice.find());
};