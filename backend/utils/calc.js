const VAT_RATE = 0.05;

exports.calculateInvoice = (items, discount = 0) => {
  let subtotal = 0;
  let vatTotal = 0;

  const updatedItems = items.map(item => {
    const base = item.rate * item.qty;
    const vat = item.vatApplicable ? base * VAT_RATE : 0;
    const total = base + vat;

    subtotal += base;
    vatTotal += vat;

    return { ...item, vat, total };
  });

  return {
    items: updatedItems,
    subtotal,
    vatTotal,
    discount,
    grandTotal: subtotal + vatTotal - discount
  };
};