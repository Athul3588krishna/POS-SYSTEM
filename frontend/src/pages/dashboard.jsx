import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Printer, Save, LogOut, BarChart3, Trash2 } from "lucide-react";
import "./dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [invoiceDetails, setInvoiceDetails] = useState({
    invNo: "",
    date: new Date().toISOString().split("T")[0],
    customerName: "",
    location: "",
    contactNo: "",
    brandName: "",
    model: "",
    totalCntr: "",
    contract: "",
    customerTrn: "",
    dnNo: "",
    dnDate: "",
    srNo: "",
    srDate: "",
    lpoNo: "",
    lpoDate: "",
    note: "",
    paymentCash: false,
    paymentCheque: false,
    discount: "",
  });

  const [products, setProducts] = useState([
    { id: 1, name: "", quantity: "", price: "", vat: 0, total: 0 },
  ]);

  const [subTotal, setSubTotal] = useState(0);
  const [totalVat, setTotalVat] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    let sub = 0;
    let vat = 0;
    products.forEach((p) => {
      const line = Number(p.quantity) * Number(p.price);
      sub += line;
      vat += line * 0.05;
    });
    const discount = Number(invoiceDetails.discount) || 0;
    setSubTotal(sub);
    setTotalVat(vat);
    setGrandTotal(sub + vat - discount);
  }, [products, invoiceDetails.discount]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInvoiceDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateProduct = (id, field, value) => {
    setProducts(
      products.map((p) => {
        if (p.id === id) {
          const updated = { ...p, [field]: value };
          const qty = Number(field === "quantity" ? value : updated.quantity);
          const price = Number(field === "price" ? value : updated.price);
          updated.total = qty * price;
          updated.vat = updated.total * 0.05;
          return updated;
        }
        return p;
      })
    );
  };

  const addProductRow = () => {
    setProducts([
      ...products,
      { id: Date.now(), name: "", quantity: "", price: "", vat: 0, total: 0 },
    ]);
  };

  const removeProductRow = (id) => {
    if (products.length > 1) setProducts(products.filter((p) => p.id !== id));
  };

  const handlePrint = () => window.print();

  const EMPTY_ROWS = 13; // total item rows in the printed invoice

  return (
    <div className="dashboard-container">
      {/* ── SIDEBAR ── */}
      <div className="dashboard-sidebar">
        <div className="sidebar-brand">
          <img src="/logo.png" alt="logo" className="sidebar-logo" />
          <span>IMAGE OFFICE</span>
        </div>
        <div className="sidebar-menu">
          <button className="active">📄 Create Invoice</button>
          <button>
            <BarChart3 size={16} /> Daily Report
          </button>
          <button className="logout-btn" onClick={() => navigate("/")}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* ── MAIN ENTRY FORM ── */}
      <div className="dashboard-main">
        <h2 className="section-title">Tax Invoice Entry</h2>

        {/* Customer & Invoice Info */}
        <div className="card entry-grid">
          <div className="form-group">
            <label>Invoice No.</label>
            <input name="invNo" value={invoiceDetails.invNo} onChange={handleInputChange} placeholder="INV-001" />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={invoiceDetails.date} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Customer TRN</label>
            <input name="customerTrn" value={invoiceDetails.customerTrn} onChange={handleInputChange} placeholder="Customer TRN" />
          </div>
          <div className="form-group span-3">
            <label>Customer Name</label>
            <input name="customerName" value={invoiceDetails.customerName} onChange={handleInputChange} placeholder="Full customer name" />
          </div>
          <div className="form-group span-2">
            <label>Area / Location</label>
            <input name="location" value={invoiceDetails.location} onChange={handleInputChange} placeholder="Area / City" />
          </div>
          <div className="form-group">
            <label>Contact No</label>
            <input name="contactNo" value={invoiceDetails.contactNo} onChange={handleInputChange} placeholder="Phone" />
          </div>
          <div className="form-group">
            <label>Brand Name</label>
            <input name="brandName" value={invoiceDetails.brandName} onChange={handleInputChange} placeholder="Brand" />
          </div>
          <div className="form-group">
            <label>Model</label>
            <input name="model" value={invoiceDetails.model} onChange={handleInputChange} placeholder="Model" />
          </div>
          <div className="form-group">
            <label>Total Cntr</label>
            <input name="totalCntr" value={invoiceDetails.totalCntr} onChange={handleInputChange} placeholder="Counter" />
          </div>
          <div className="form-group span-3">
            <label>Contract</label>
            <input name="contract" value={invoiceDetails.contract} onChange={handleInputChange} placeholder="Contract details" />
          </div>
        </div>

        {/* Reference Numbers */}
        <div className="card ref-entry-grid">
          <div className="form-group">
            <label>D.N No</label>
            <input name="dnNo" value={invoiceDetails.dnNo} onChange={handleInputChange} placeholder="D.N No" />
          </div>
          <div className="form-group">
            <label>D.N Date</label>
            <input type="date" name="dnDate" value={invoiceDetails.dnDate} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>S.R No</label>
            <input name="srNo" value={invoiceDetails.srNo} onChange={handleInputChange} placeholder="S.R No" />
          </div>
          <div className="form-group">
            <label>S.R Date</label>
            <input type="date" name="srDate" value={invoiceDetails.srDate} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>L.P.O No</label>
            <input name="lpoNo" value={invoiceDetails.lpoNo} onChange={handleInputChange} placeholder="L.P.O No" />
          </div>
          <div className="form-group">
            <label>L.P.O Date</label>
            <input type="date" name="lpoDate" value={invoiceDetails.lpoDate} onChange={handleInputChange} />
          </div>
        </div>

        {/* Products */}
        <div className="card">
          <h3 className="products-heading">Products — VAT 5% Auto Applied</h3>
          <table className="products-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Particulars</th>
                <th>Qty</th>
                <th>Rate (AED)</th>
                <th>VAT 5%</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id}>
                  <td className="row-num">{i + 1}</td>
                  <td>
                    <input value={p.name} onChange={(e) => updateProduct(p.id, "name", e.target.value)} placeholder="Item description" />
                  </td>
                  <td>
                    <input type="number" min="0" value={p.quantity} onChange={(e) => updateProduct(p.id, "quantity", e.target.value)} placeholder="0" />
                  </td>
                  <td>
                    <input type="number" min="0" value={p.price} onChange={(e) => updateProduct(p.id, "price", e.target.value)} placeholder="0.00" />
                  </td>
                  <td className="calc-cell">{p.vat > 0 ? p.vat.toFixed(2) : "—"}</td>
                  <td className="calc-cell">{p.total > 0 ? p.total.toFixed(2) : "—"}</td>
                  <td>
                    <button onClick={() => removeProductRow(p.id)} className="btn-danger">
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn-secondary add-row-btn" onClick={addProductRow}>
            <Plus size={15} /> Add Item
          </button>
        </div>

        {/* Totals + Note */}
        <div className="card totals-entry">
          <div className="note-group">
            <label>Note</label>
            <textarea name="note" value={invoiceDetails.note} onChange={handleInputChange} rows={3} placeholder="Any note for this invoice..." />
          </div>
          <div className="totals-summary">
            <div className="total-line">
              <span>Without VAT</span><span>AED {subTotal.toFixed(2)}</span>
            </div>
            <div className="total-line pink">
              <span>VAT @ 5%</span><span>AED {totalVat.toFixed(2)}</span>
            </div>
            <div className="total-line">
              <span>Discount</span>
              <input type="number" name="discount" value={invoiceDetails.discount} onChange={handleInputChange} placeholder="0.00" className="discount-input" />
            </div>
            <div className="total-line pink bold">
              <span>G. Total</span><span>AED {grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment + Actions */}
        <div className="card payment-actions-row">
          <div className="payment-check-group">
            <span>Payment:</span>
            <label><input type="checkbox" name="paymentCash" checked={invoiceDetails.paymentCash} onChange={handleInputChange} /> Cash</label>
            <label><input type="checkbox" name="paymentCheque" checked={invoiceDetails.paymentCheque} onChange={handleInputChange} /> Cheque</label>
          </div>
          <div className="actions-group">
            <button className="btn-secondary"><Save size={16} /> Save Record</button>
            <button className="btn-primary" onClick={handlePrint}><Printer size={16} /> Print A4 Invoice</button>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          PRINTABLE A4 INVOICE — hidden on screen
          ════════════════════════════════════════════ */}
      <div className="printable-invoice" id="printable">

        {/* Left brand strip */}
        <div className="brand-strip">
          {["Canon", "RICOH", "KYOCERa neshuatech", "Panasonic", "SHARP", "KONICA MINOLTA", "TOSHIBA", "hp HEWLETT PACKARD", "DEVELOP", "brother"].map((b, i) => (
            <span key={i}>{b}</span>
          ))}
        </div>

        {/* Main invoice body */}
        <div className="inv-body">

          {/* ── HEADER ── */}
          <div className="inv-header">
            <div className="inv-logo-block">
              <img src="/logo.png" alt="logo" className="inv-logo" />
              <div className="logo-sub">
                <div>PHOTOCOPIER MAINT</div>
                <div>&amp; STATIONERY EST.</div>
              </div>
            </div>

            <div className="inv-company-info">
              <div className="company-arabic-name">
                إيـمـاج اوفـيـس سـيـلـوشـن لاصلاح الالات ومعدات النسخ والقرطاسية
              </div>
              <div className="company-details-line">
                تلفون: ٧٩٣-٣٢٥١-٠٥٠ - ٤٣١-٧٤٣٢-٠٥٠ - فاكس: ٣٩٧-٧٢١٣-٠٣ - ص.ب: ٨٥٢٠٧ - الصناعية - العين - الإ.ع.م.
              </div>
              <div className="company-details-line">
                Tel.: 050-3251793 - 050-7432431 &nbsp;·&nbsp; Fax: 03-7213397 &nbsp;·&nbsp; P.O.Box: 85207 - Industrial Area - Al Ain - U.A.E.
              </div>
              <div className="company-details-line">
                e - m a i l : &nbsp; i m a g e a l a i n @ g m a i l . c o m
              </div>
            </div>
          </div>

          {/* ── TAX INVOICE TITLE ── */}
          <div className="inv-title-row">
            <span className="inv-title-arabic">فاتورة ضريبية</span>
            <span className="inv-title-eng">TAX INVOICE</span>
          </div>

          {/* ── TRN ROW ── */}
          <div className="trn-row">
            <div className="trn-left">TRN: 100335760300003</div>
            <div className="trn-right">
              <span className="trn-label">Customer TRN:</span>
              <div className="trn-boxes">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div className="trn-box" key={i}>
                    {invoiceDetails.customerTrn?.[i] || ""}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── CUSTOMER INFO GRID ── */}
          <table className="info-table">
            <tbody>
              <tr>
                <td className="info-cell" style={{ width: "50%" }}>
                  Inv. No. : <strong>{invoiceDetails.invNo}</strong>
                </td>
                <td className="info-cell">
                  Date: <strong>{invoiceDetails.date}</strong>
                </td>
              </tr>
              <tr>
                <td className="info-cell" colSpan={2}>
                  Customer Name: <strong>{invoiceDetails.customerName}</strong>
                </td>
              </tr>
              <tr>
                <td className="info-cell">
                  Area/Location: <strong>{invoiceDetails.location}</strong>
                </td>
                <td className="info-cell">
                  Contact No: <strong>{invoiceDetails.contactNo}</strong>
                </td>
              </tr>
              <tr>
                <td className="info-cell" style={{ width: "40%" }}>
                  Brand Name: <strong>{invoiceDetails.brandName}</strong>
                </td>
                <td className="info-cell" style={{ width: "30%" }}>
                  Model: <strong>{invoiceDetails.model}</strong>
                </td>
                <td className="info-cell">
                  Total Cntr: <strong>{invoiceDetails.totalCntr}</strong>
                </td>
              </tr>
              <tr>
                <td className="info-cell" colSpan={2}>
                  Contract: <strong>{invoiceDetails.contract}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          {/* ── REFERENCE TABLE (D.N / S.R / L.P.O) ── */}
          <table className="ref-table">
            <tbody>
              <tr>
                <td className="ref-cell">D.N No: <strong>{invoiceDetails.dnNo}</strong></td>
                <td className="ref-cell">S.R No: <strong>{invoiceDetails.srNo}</strong></td>
                <td className="ref-cell">L.P.O No: <strong>{invoiceDetails.lpoNo}</strong></td>
              </tr>
              <tr>
                <td className="ref-cell">Date: <strong>{invoiceDetails.dnDate}</strong></td>
                <td className="ref-cell">Date: <strong>{invoiceDetails.srDate}</strong></td>
                <td className="ref-cell">Date: <strong>{invoiceDetails.lpoDate}</strong></td>
              </tr>
            </tbody>
          </table>

          {/* ── ITEMS TABLE ── */}
          <table className="items-table">
            <thead>
              <tr className="items-header">
                <th className="col-no">
                  <div>الرقم</div>
                  <div>No.</div>
                </th>
                <th className="col-particulars">
                  <div>التفاصيل</div>
                  <div>Particulars</div>
                </th>
                <th className="col-qty">
                  <div>العدد</div>
                  <div>Qty.</div>
                </th>
                <th className="col-rate">
                  <div>سعر الوحدة</div>
                  <div>Rate</div>
                </th>
                <th className="col-vat">
                  <div>الضريبة</div>
                  <div>VAT(5%)</div>
                </th>
                <th className="col-total">
                  <div>المبلغ الاجمالي</div>
                  <div>Total Amount</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id} className={i % 2 === 1 ? "row-pink" : ""}>
                  <td className="col-no">{i + 1}</td>
                  <td className="col-particulars text-left">{p.name}</td>
                  <td className="col-qty">{p.quantity}</td>
                  <td className="col-rate">{p.price ? Number(p.price).toFixed(2) : ""}</td>
                  <td className="col-vat">{p.vat > 0 ? p.vat.toFixed(2) : ""}</td>
                  <td className="col-total">{p.total > 0 ? p.total.toFixed(2) : ""}</td>
                </tr>
              ))}
              {Array.from({ length: Math.max(0, EMPTY_ROWS - products.length) }).map((_, i) => (
                <tr key={`e-${i}`} className={(products.length + i) % 2 === 1 ? "row-pink empty-row" : "empty-row"}>
                  <td></td><td></td><td></td><td></td><td></td><td></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ── FOOTER SECTION ── */}
          <table className="footer-table">
            <tbody>
              <tr>
                {/* Note + Total Dhs */}
                <td className="footer-left" rowSpan={4}>
                  <div className="note-line">Note: <span>{invoiceDetails.note}</span></div>
                </td>
                <td className="footer-label">Without VAT</td>
                <td className="footer-value">{subTotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="footer-label footer-pink">VAT @5%</td>
                <td className="footer-value footer-pink">{totalVat.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="footer-label">Discount</td>
                <td className="footer-value">{invoiceDetails.discount ? Number(invoiceDetails.discount).toFixed(2) : ""}</td>
              </tr>
              <tr>
                <td className="footer-label footer-pink">G. total</td>
                <td className="footer-value footer-pink"><strong>{grandTotal.toFixed(2)}</strong></td>
              </tr>
              {/* Total Dhs row */}
              <tr>
                <td className="footer-total-dhs" colSpan={1}>
                  Total Dhs. <strong>{grandTotal.toFixed(2)}</strong>
                </td>
                <td className="footer-label">Discount</td>
                <td className="footer-value"></td>
              </tr>
            </tbody>
          </table>

          {/* ── PAYMENT ROW ── */}
          <div className="payment-row">
            <span className="payment-desc-label">Payment Description</span>
            <span className="payment-opt">
              Cash: <span className="checkbox-box">{invoiceDetails.paymentCash ? "✓" : ""}</span>
            </span>
            <span className="payment-opt">
              Cheque: <span className="checkbox-box">{invoiceDetails.paymentCheque ? "✓" : ""}</span>
            </span>
          </div>

          {/* ── SIGNATURE ROW ── */}
          <div className="signature-row">
            <span>Customer Signature: ___________________________</span>
            <span>For Image Office Solutions</span>
          </div>

        </div>{/* /inv-body */}
      </div>{/* /printable-invoice */}
    </div>
  );
};

export default Dashboard;