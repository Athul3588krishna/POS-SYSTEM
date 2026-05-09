const VAT_RATE = 0.05;

exports.calculateInvoice = (items, discount = 0) => {
  let subtotal = 0;
  let vatTotal = 0;
  const normalizedDiscount = Math.max(Number(discount) || 0, 0);

  const updatedItems = items.map(item => {
    const rate = Number(item.rate) || 0;
    const qty = Number(item.qty) || 0;
    const base = rate * qty;
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
    discount: normalizedDiscount,
    grandTotal: Math.max(subtotal + vatTotal - normalizedDiscount, 0)
  };
};
