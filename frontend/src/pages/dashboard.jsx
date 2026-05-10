import { useMemo, useState } from "react";

const currency = new Intl.NumberFormat("en-AE", {
  style: "currency",
  currency: "AED"
});

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const padDatePart = (value) => String(value).padStart(2, "0");

const getDateParts = (date) => {
  if (!date) return null;
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return null;

  return {
    year: value.getFullYear(),
    month: padDatePart(value.getMonth() + 1),
    day: padDatePart(value.getDate())
  };
};

const getMonthKey = (date) => {
  const parts = getDateParts(date);
  return parts ? `${parts.year}-${parts.month}` : "";
};

const getDateKey = (date) => {
  const parts = getDateParts(date);
  return parts ? `${parts.year}-${parts.month}-${parts.day}` : "";
};

const getTodayKey = () => getDateKey(new Date());

const formatWarranty = (months = 0) => {
  const value = Number(months) || 0;
  if (value <= 0) return "No warranty";
  if (value === 1) return "1 month";
  if (value % 12 === 0) {
    const years = value / 12;
    return years === 1 ? "1 year" : `${years} years`;
  }
  return `${value} months`;
};

const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "");

const summarizeInvoices = (invoiceList) =>
  invoiceList.reduce(
    (summary, invoice) => ({
      invoices: summary.invoices + 1,
      items: summary.items + (invoice.items || []).reduce((sum, item) => sum + Number(item.qty || 0), 0),
      subtotal: summary.subtotal + Number(invoice.subtotal || 0),
      vat: summary.vat + Number(invoice.vatTotal || 0),
      discount: summary.discount + Number(invoice.discount || 0),
      total: summary.total + Number(invoice.grandTotal || 0)
    }),
    { invoices: 0, items: 0, subtotal: 0, vat: 0, discount: 0, total: 0 }
  );

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const buildInvoiceHtml = (invoice) => {
  const rows = (invoice.items || []).map((item) => `
    <tr>
      <td>
        <strong>${escapeHtml(item.name)}</strong>
        ${item.serialNumber ? `<small>Serial: ${escapeHtml(item.serialNumber)}</small>` : ""}
        ${item.warrantyMonths ? `<small>Warranty: ${escapeHtml(formatWarranty(item.warrantyMonths))}${item.warrantyUntil ? ` until ${escapeHtml(formatDate(item.warrantyUntil))}` : ""}</small>` : ""}
      </td>
      <td>${Number(item.qty || 0)}</td>
      <td>${currency.format(item.rate || 0)}</td>
      <td>${currency.format(item.vat || 0)}</td>
      <td>${currency.format(item.total || 0)}</td>
    </tr>
  `).join("");

  return `
    <!doctype html>
    <html>
      <head>
        <title>${escapeHtml(invoice.invoiceNumber || "Invoice")}</title>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; padding: 32px; color: #111827; font-family: Arial, sans-serif; }
          .invoice { max-width: 820px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; gap: 24px; border-bottom: 2px solid #111827; padding-bottom: 18px; margin-bottom: 24px; }
          h1 { margin: 0 0 6px; font-size: 28px; }
          h2 { margin: 0; font-size: 18px; }
          p { margin: 4px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 22px; }
	          th, td { border-bottom: 1px solid #d1d5db; padding: 10px 8px; text-align: left; }
	          th { background: #f3f4f6; font-size: 12px; text-transform: uppercase; }
	          small { display: block; color: #6b7280; font-size: 11px; margin-top: 3px; }
          .totals { width: 320px; margin-left: auto; margin-top: 22px; }
          .line { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid #e5e7eb; }
          .grand { font-size: 18px; font-weight: 700; border-bottom: 0; }
          .muted { color: #6b7280; }
          @media print { body { padding: 18px; } }
        </style>
      </head>
      <body>
        <main class="invoice">
          <section class="header">
            <div>
              <h1>POS Billing System</h1>
              <p class="muted">Tax Invoice</p>
            </div>
            <div>
              <h2>${escapeHtml(invoice.invoiceNumber)}</h2>
              <p>${invoice.date ? new Date(invoice.date).toLocaleString() : ""}</p>
              <p>Payment: ${escapeHtml(invoice.paymentMethod || "Cash")}</p>
            </div>
          </section>
          <section>
            <h2>Bill To</h2>
            <p>${escapeHtml(invoice.customer?.name || "Walk-in Customer")}</p>
            <p class="muted">${escapeHtml(invoice.customer?.contact || "")}</p>
          </section>
          <table>
            <thead>
              <tr><th>Item</th><th>Qty</th><th>Rate</th><th>VAT</th><th>Total</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <section class="totals">
            <div class="line"><span>Subtotal</span><strong>${currency.format(invoice.subtotal || 0)}</strong></div>
            <div class="line"><span>VAT</span><strong>${currency.format(invoice.vatTotal || 0)}</strong></div>
            <div class="line"><span>Discount</span><strong>${currency.format(invoice.discount || 0)}</strong></div>
            <div class="line grand"><span>Grand Total</span><strong>${currency.format(invoice.grandTotal || 0)}</strong></div>
          </section>
        </main>
      </body>
    </html>
  `;
};

const downloadInvoicePdf = (invoice) => {
  const printWindow = window.open("", "_blank", "width=900,height=700");

  if (!printWindow) {
    window.alert("Popup blocked. Please allow popups to download the bill PDF.");
    return;
  }

  printWindow.document.open();
  printWindow.document.write(buildInvoiceHtml(invoice));
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

const Dashboard = ({
  user,
  products,
  invoices,
  onLogout,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  onCreateInvoice
}) => {
  const isAdmin = user?.role === "admin";
  const [activeView, setActiveView] = useState(isAdmin ? "daily" : "dashboard");
  const [dailyDate, setDailyDate] = useState(getTodayKey);
  const [monthlyPeriod, setMonthlyPeriod] = useState(() => getTodayKey().slice(0, 7));
  const [productSearch, setProductSearch] = useState("");
  const [productForm, setProductForm] = useState({
    name: "",
	    category: "General",
	    price: "",
	    stock: "",
	    serialNumber: "",
	    warrantyMonths: "",
	    vatApplicable: true
	  });
  const [invoiceForm, setInvoiceForm] = useState({
    customerName: "",
    customerContact: "",
    discount: 0,
    paymentMethod: "Cash"
  });
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [lastInvoice, setLastInvoice] = useState(null);

  const totals = useMemo(() => {
    return cart.reduce(
      (summary, item) => {
        const product = products.find((entry) => entry._id === item.productId);
        if (!product) return summary;

        const base = Number(product.price) * Number(item.qty);
        const vat = product.vatApplicable ? base * 0.05 : 0;

        return {
          subtotal: summary.subtotal + base,
          vat: summary.vat + vat,
          total: summary.total + base + vat
        };
      },
      { subtotal: 0, vat: 0, total: 0 }
    );
  }, [cart, products]);

  const filteredProducts = useMemo(() => {
    const search = productSearch.trim().toLowerCase();
    if (!search) return products;

    return products.filter((product) => {
      const fields = [
        product.name,
        product.category,
        product.serialNumber,
        formatWarranty(product.warrantyMonths),
        product.vatApplicable ? "vat" : "no vat"
      ];

      return fields.some((field) => String(field || "").toLowerCase().includes(search));
    });
  }, [productSearch, products]);

  const dailyInvoices = useMemo(
    () => invoices.filter((invoice) => getDateKey(invoice.date || invoice.createdAt) === dailyDate),
    [dailyDate, invoices]
  );

  const monthlyInvoices = useMemo(
    () => invoices.filter((invoice) => getMonthKey(invoice.date || invoice.createdAt) === monthlyPeriod),
    [invoices, monthlyPeriod]
  );

  const dailySummary = useMemo(() => summarizeInvoices(dailyInvoices), [dailyInvoices]);
  const monthlySummary = useMemo(() => summarizeInvoices(monthlyInvoices), [monthlyInvoices]);

  const monthlyBreakdown = useMemo(() => {
    const weeks = new Map();

    monthlyInvoices.forEach((invoice) => {
      const invoiceDate = new Date(invoice.date || invoice.createdAt);
      const weekNumber = Math.ceil(invoiceDate.getDate() / 7);
      const key = `Week ${weekNumber}`;
      const current = weeks.get(key) || [];
      weeks.set(key, [...current, invoice]);
    });

    return Array.from(weeks.entries())
      .sort(([left], [right]) => Number(left.replace("Week ", "")) - Number(right.replace("Week ", "")))
      .map(([label, entries]) => ({ label, ...summarizeInvoices(entries) }));
  }, [monthlyInvoices]);

  const bestDailySale = dailyInvoices.reduce(
    (best, invoice) => (Number(invoice.grandTotal || 0) > Number(best?.grandTotal || 0) ? invoice : best),
    null
  );

  const bestMonthlySale = monthlyInvoices.reduce(
    (best, invoice) => (Number(invoice.grandTotal || 0) > Number(best?.grandTotal || 0) ? invoice : best),
    null
  );

  const submitProduct = async (event) => {
    event.preventDefault();
    await onCreateProduct(productForm);
	    setProductForm({
	      name: "",
	      category: "General",
	      price: "",
	      stock: "",
	      serialNumber: "",
	      warrantyMonths: "",
	      vatApplicable: true
	    });
    setMessage("Product saved");
  };

  const addCartItem = () => {
    if (products.length === 0) return;
    setCart((current) => [
      ...current,
      { productId: products[0]._id, qty: 1 }
    ]);
  };

  const updateCartItem = (index, changes) => {
    setCart((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...changes } : item
      )
    );
  };

  const removeCartItem = (index) => {
    setCart((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const submitInvoice = async (event) => {
    event.preventDefault();
    const invoice = await onCreateInvoice({
      customer: {
        name: invoiceForm.customerName,
        contact: invoiceForm.customerContact
      },
      discount: Number(invoiceForm.discount) || 0,
      paymentMethod: invoiceForm.paymentMethod,
      items: cart
    });

    setLastInvoice(invoice);
    setCart([]);
    setInvoiceForm({
      customerName: "",
      customerContact: "",
      discount: 0,
      paymentMethod: "Cash"
    });
    setMessage("Invoice created and stock updated");
  };

  return (
    <main className="dashboard">
      <header className="topbar">
        <div>
          <p className="eyebrow">POS Billing</p>
          <h1>
            {isAdmin && activeView === "daily" && "Daily Sales Report"}
            {isAdmin && activeView === "monthly" && "Monthly Sales Report"}
            {(!isAdmin || activeView === "dashboard") && (isAdmin ? "Admin Dashboard" : "Billing Counter")}
          </h1>
        </div>
        <div className="user-box">
          <span>{user?.name || "User"}</span>
          <strong className="role-badge">{isAdmin ? "Admin" : "Billing Staff"}</strong>
          <button type="button" onClick={onLogout}>Logout</button>
        </div>
      </header>

      {isAdmin && (
        <nav className="report-tabs" aria-label="Admin views">
          <button
            className={activeView === "dashboard" ? "active" : ""}
            type="button"
            onClick={() => setActiveView("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={activeView === "daily" ? "active" : ""}
            type="button"
            onClick={() => setActiveView("daily")}
          >
            Daily Report
          </button>
          <button
            className={activeView === "monthly" ? "active" : ""}
            type="button"
            onClick={() => setActiveView("monthly")}
          >
            Monthly Report
          </button>
        </nav>
      )}

      {message && <p className="success-message">{message}</p>}

      {isAdmin && activeView === "dashboard" && (
        <section className="metric-grid">
          <article><span>Products</span><strong>{products.length}</strong></article>
          <article><span>Invoices</span><strong>{invoices.length}</strong></article>
        </section>
      )}

      {isAdmin && activeView === "daily" && (
        <section className="report-view">
          <div className="report-toolbar">
            <label>
              Report date
              <input type="date" value={dailyDate} onChange={(event) => setDailyDate(event.target.value)} />
            </label>
          </div>

          <section className="metric-grid report-metrics">
            <article><span>Invoices</span><strong>{dailySummary.invoices}</strong></article>
            <article><span>Items Sold</span><strong>{dailySummary.items}</strong></article>
            <article><span>Sales Total</span><strong>{currency.format(dailySummary.total)}</strong></article>
            <article><span>VAT Collected</span><strong>{currency.format(dailySummary.vat)}</strong></article>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <h2>Daily Sales</h2>
              {bestDailySale && <span className="report-note">Top invoice: {bestDailySale.invoiceNumber}</span>}
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Invoice</th><th>Customer</th><th>Items</th><th>Subtotal</th><th>VAT</th><th>Discount</th><th>Total</th><th>Payment</th></tr>
                </thead>
                <tbody>
                  {dailyInvoices.map((invoice) => (
                    <tr key={invoice._id}>
                      <td>{invoice.invoiceNumber}</td>
                      <td>{invoice.customer?.name || "Walk-in"}</td>
                      <td>{invoice.items?.length || 0}</td>
                      <td>{currency.format(invoice.subtotal || 0)}</td>
                      <td>{currency.format(invoice.vatTotal || 0)}</td>
                      <td>{currency.format(invoice.discount || 0)}</td>
                      <td><strong>{currency.format(invoice.grandTotal || 0)}</strong></td>
                      <td>{invoice.paymentMethod || "Cash"}</td>
                    </tr>
                  ))}
                  {dailyInvoices.length === 0 && (
                    <tr><td colSpan="8" className="empty-state">No invoices found for this date.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      )}

      {isAdmin && activeView === "monthly" && (
        <section className="report-view">
          <div className="report-toolbar">
            <label>
              Report month
              <input type="month" value={monthlyPeriod} onChange={(event) => setMonthlyPeriod(event.target.value)} />
            </label>
          </div>

          <section className="metric-grid report-metrics">
            <article><span>Invoices</span><strong>{monthlySummary.invoices}</strong></article>
            <article><span>Items Sold</span><strong>{monthlySummary.items}</strong></article>
            <article><span>Sales Total</span><strong>{currency.format(monthlySummary.total)}</strong></article>
            <article><span>VAT Collected</span><strong>{currency.format(monthlySummary.vat)}</strong></article>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <h2>{MONTH_NAMES[Number(monthlyPeriod.slice(5, 7)) - 1]} {monthlyPeriod.slice(0, 4)} Breakdown</h2>
              {bestMonthlySale && <span className="report-note">Top invoice: {bestMonthlySale.invoiceNumber}</span>}
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Period</th><th>Invoices</th><th>Items Sold</th><th>Subtotal</th><th>VAT</th><th>Discount</th><th>Total</th></tr>
                </thead>
                <tbody>
                  {monthlyBreakdown.map((entry) => (
                    <tr key={entry.label}>
                      <td>{entry.label}</td>
                      <td>{entry.invoices}</td>
                      <td>{entry.items}</td>
                      <td>{currency.format(entry.subtotal)}</td>
                      <td>{currency.format(entry.vat)}</td>
                      <td>{currency.format(entry.discount)}</td>
                      <td><strong>{currency.format(entry.total)}</strong></td>
                    </tr>
                  ))}
                  {monthlyBreakdown.length === 0 && (
                    <tr><td colSpan="7" className="empty-state">No invoices found for this month.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      )}

      {activeView === "dashboard" && (
      <div className={`workspace ${isAdmin ? "admin-workspace" : ""}`}>
        <section className="panel">
          <div className="panel-heading">
            <h2>Products</h2>
          </div>

          {isAdmin && (
            <form className="product-form" onSubmit={submitProduct}>
              <input placeholder="Product name" value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} required />
	              <input placeholder="Category" value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })} />
	              <input min="0" placeholder="Price" type="number" value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} required />
	              <input min="0" placeholder="Stock" type="number" value={productForm.stock} onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })} required />
	              <input placeholder="Serial number" value={productForm.serialNumber} onChange={(event) => setProductForm({ ...productForm, serialNumber: event.target.value })} />
	              <input min="0" placeholder="Warranty months" type="number" value={productForm.warrantyMonths} onChange={(event) => setProductForm({ ...productForm, warrantyMonths: event.target.value })} />
	              <label className="checkbox-line">
	                <input checked={productForm.vatApplicable} type="checkbox" onChange={(event) => setProductForm({ ...productForm, vatApplicable: event.target.checked })} />
	                VAT
              </label>
	              <button type="submit">Add product</button>
	            </form>
	          )}

	          <div className="product-search">
	            <input
	              type="search"
	              placeholder="Find products by name, category, serial, warranty..."
	              value={productSearch}
	              onChange={(event) => setProductSearch(event.target.value)}
	            />
	          </div>

	          <div className="table-wrap">
	            <table>
	              <thead>
	                <tr><th>Name</th><th>Serial</th><th>Warranty</th><th>Price</th><th>Stock</th><th>VAT</th><th></th></tr>
	              </thead>
	              <tbody>
	                {filteredProducts.map((product) => (
	                  <tr key={product._id}>
	                    <td><strong>{product.name}</strong><small>{product.category}</small></td>
	                    <td>{product.serialNumber || "-"}</td>
	                    <td>{formatWarranty(product.warrantyMonths)}</td>
	                    <td>{currency.format(product.price || 0)}</td>
	                    <td>
                      {isAdmin ? (
                        <input className="stock-input" min="0" type="number" value={product.stock} onChange={(event) => onUpdateProduct(product._id, { stock: Number(event.target.value) })} />
                      ) : (
                        product.stock
                      )}
                    </td>
                    <td>{product.vatApplicable ? "Yes" : "No"}</td>
                    <td>
                      {isAdmin && (
                        <button className="danger" type="button" onClick={() => onDeleteProduct(product._id)}>Delete</button>
                      )}
	                    </td>
	                  </tr>
	                ))}
	                {filteredProducts.length === 0 && (
	                  <tr><td colSpan="7" className="empty-state">No products found.</td></tr>
	                )}
	              </tbody>
	            </table>
	          </div>
        </section>

        {!isAdmin && (
          <section className="panel">
            <div className="panel-heading">
              <h2>Create Invoice</h2>
              <button type="button" onClick={addCartItem} disabled={products.length === 0}>Add item</button>
            </div>

            <form className="invoice-form" onSubmit={submitInvoice}>
              <div className="field-row">
                <input placeholder="Customer name" value={invoiceForm.customerName} onChange={(event) => setInvoiceForm({ ...invoiceForm, customerName: event.target.value })} />
                <input placeholder="Contact" value={invoiceForm.customerContact} onChange={(event) => setInvoiceForm({ ...invoiceForm, customerContact: event.target.value })} />
              </div>

              {cart.map((item, index) => (
                <div className="cart-row" key={`${item.productId}-${index}`}>
                  <select value={item.productId} onChange={(event) => updateCartItem(index, { productId: event.target.value })}>
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name} {product.serialNumber ? `- ${product.serialNumber}` : ""} ({product.stock} left, {formatWarranty(product.warrantyMonths)})
                      </option>
                    ))}
                  </select>
                  <input min="1" type="number" value={item.qty} onChange={(event) => updateCartItem(index, { qty: Number(event.target.value) })} />
                  <button type="button" onClick={() => removeCartItem(index)}>Remove</button>
                </div>
              ))}

              <div className="field-row">
                <input min="0" type="number" placeholder="Discount" value={invoiceForm.discount} onChange={(event) => setInvoiceForm({ ...invoiceForm, discount: event.target.value })} />
                <select value={invoiceForm.paymentMethod} onChange={(event) => setInvoiceForm({ ...invoiceForm, paymentMethod: event.target.value })}>
                  <option>Cash</option>
                  <option>Card</option>
                  <option>Bank Transfer</option>
                </select>
              </div>

              <div className="totals">
                <span>Subtotal {currency.format(totals.subtotal)}</span>
                <span>VAT {currency.format(totals.vat)}</span>
                <strong>Total {currency.format(Math.max(totals.total - Number(invoiceForm.discount || 0), 0))}</strong>
              </div>

              <button type="submit" disabled={cart.length === 0}>Save invoice</button>
            </form>

            {lastInvoice && (
              <div className="last-invoice">
                <div>
                  <strong>{lastInvoice.invoiceNumber}</strong>
                  <span>{currency.format(lastInvoice.grandTotal || 0)}</span>
                </div>
                <button type="button" onClick={() => downloadInvoicePdf(lastInvoice)}>Download PDF</button>
              </div>
            )}
          </section>
        )}
      </div>
      )}

      {isAdmin && activeView === "dashboard" && (
        <section className="panel invoice-history">
          <div className="panel-heading">
            <h2>Recent Invoices</h2>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Invoice</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th></th></tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice._id}>
                    <td>{invoice.invoiceNumber}</td>
                    <td>{invoice.customer?.name || "Walk-in"}</td>
                    <td>{invoice.items?.length || 0}</td>
                    <td>{currency.format(invoice.grandTotal || 0)}</td>
                    <td>{invoice.date ? new Date(invoice.date).toLocaleString() : ""}</td>
                    <td><button type="button" onClick={() => downloadInvoicePdf(invoice)}>PDF</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
};

export default Dashboard;
