import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Plus, Printer, Save, LogOut, BarChart3, Search, UserPlus, Trash2 } from "lucide-react";
import "./dashboard.css";

const API_BASE = "http://localhost:5000/api";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Customer State
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [customerExists, setCustomerExists] = useState(false);
  
  // Products State
  const [products, setProducts] = useState([
    { id: 1, name: "", quantity: 1, price: 0, total: 0 }
  ]);
  
  // Totals State
  const [subTotal, setSubTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  // App State
  const [loading, setLoading] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [dailyReport, setDailyReport] = useState({ totalRevenue: 0, totalInvoices: 0 });

  // Calculate totals whenever products change
  useEffect(() => {
    const newSubTotal = products.reduce((acc, curr) => acc + curr.total, 0);
    setSubTotal(newSubTotal);
    setGrandTotal(newSubTotal); // Add tax logic here if needed
  }, [products]);

  // Handle Customer Search
  const searchCustomer = async () => {
    if (!phone) return alert("Please enter a phone number");
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/customers?phone=${phone}`);
      if (res.data && res.data.name) {
        setName(res.data.name);
        setCustomerExists(true);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setCustomerExists(false);
        alert("Customer not found. You can create a new one.");
      } else {
        alert("Error searching customer.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Create Customer
  const createCustomer = async () => {
    if (!phone || !name) return alert("Please provide both name and phone");
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/customers`, { name, phone });
      setCustomerExists(true);
      alert("Customer created successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating customer");
    } finally {
      setLoading(false);
    }
  };

  // Handle Product Changes
  const updateProduct = (id, field, value) => {
    const updatedProducts = products.map(p => {
      if (p.id === id) {
        const updated = { ...p, [field]: value };
        if (field === 'quantity' || field === 'price') {
            const qty = field === 'quantity' ? Number(value) : Number(p.quantity);
            const prc = field === 'price' ? Number(value) : Number(p.price);
            updated.total = qty * prc;
        }
        return updated;
      }
      return p;
    });
    setProducts(updatedProducts);
  };

  const addProductRow = () => {
    setProducts([
      ...products, 
      { id: Date.now(), name: "", quantity: 1, price: 0, total: 0 }
    ]);
  };

  const removeProductRow = (id) => {
    if (products.length === 1) return;
    setProducts(products.filter(p => p.id !== id));
  };

  // Handle Save Invoice
  const saveInvoice = async () => {
    if (!name || !phone) return alert("Customer details are required");
    const validProducts = products.filter(p => p.name.trim() !== "");
    if (validProducts.length === 0) return alert("Add at least one product");

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/invoices`, {
        customer: { name, phone },
        products: validProducts,
        subTotal,
        grandTotal
      });
      alert("Invoice saved successfully!");
      // Reset form
      setProducts([{ id: Date.now(), name: "", quantity: 1, price: 0, total: 0 }]);
      setPhone("");
      setName("");
      setCustomerExists(false);
    } catch (err) {
      alert("Error saving invoice");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Handle Daily Report
  const openReportMode = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/invoices/daily-report`);
      setDailyReport(res.data);
      setReportModal(true);
    } catch (error) {
      alert("Error fetching report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <div className="dashboard-sidebar">
        <div className="sidebar-brand">POS BILLING</div>
        <div className="sidebar-menu">
          <button className="active">Create Invoice</button>
          <button onClick={openReportMode}><BarChart3 size={18} style={{marginRight: '8px', verticalAlign: 'middle'}}/> Daily Report</button>
          <button className="logout-btn" onClick={() => navigate("/")}><LogOut size={18} style={{marginRight: '8px', verticalAlign: 'middle'}}/> Logout</button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="dashboard-main">
        <h2 className="section-title">New Invoice</h2>

        {/* CUSTOMER SECTION */}
        <div className="card">
          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="text" 
                placeholder="Enter 10-digit phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <button className="btn-secondary" onClick={searchCustomer} disabled={loading}>
              <Search size={18} /> Search
            </button>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Customer Name</label>
              <input 
                type="text" 
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                readOnly={customerExists}
              />
            </div>
            {!customerExists && name && phone && (
              <button className="btn-secondary" onClick={createCustomer} disabled={loading}>
                <UserPlus size={18} /> Create
              </button>
            )}
          </div>
        </div>

        {/* PRODUCTS SECTION */}
        <div className="card">
          <h3 style={{marginBottom: '10px', color: '#c00026'}}>Products</h3>
           <table className="products-table">
            <thead>
              <tr>
                <th width="40%">Item Name</th>
                <th width="15%">Qty</th>
                <th width="15%">Price (₹)</th>
                <th width="20%">Total (₹)</th>
                <th width="10%">Act</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <input 
                      type="text" 
                      placeholder="Product Details"
                      value={p.name}
                      onChange={(e) => updateProduct(p.id, 'name', e.target.value)}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      min="1"
                      value={p.quantity}
                      onChange={(e) => updateProduct(p.id, 'quantity', e.target.value)}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      min="0"
                      value={p.price}
                      onChange={(e) => updateProduct(p.id, 'price', e.target.value)}
                    />
                  </td>
                  <td style={{fontWeight: 'bold'}}>₹{p.total.toFixed(2)}</td>
                  <td>
                    <button className="btn-danger" onClick={() => removeProductRow(p.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
           </table>

           <button className="btn-secondary" style={{marginTop: '15px'}} onClick={addProductRow}>
             <Plus size={18} style={{verticalAlign: 'middle', marginRight: '5px'}}/> Add Item
           </button>

           <div className="totals">
             <div>Subtotal: ₹{subTotal.toFixed(2)}</div>
             <div className="grand-total">Grand Total: ₹{grandTotal.toFixed(2)}</div>
           </div>
        </div>

        {/* ACTIONS */}
        <div className="invoice-actions">
           <button className="btn-secondary" onClick={handlePrint}><Printer size={18} style={{marginRight: '8px', verticalAlign: 'middle'}}/> Print A4</button>
           <button className="btn-primary" onClick={saveInvoice} disabled={loading}><Save size={18} style={{marginRight: '8px', verticalAlign: 'middle'}}/> Save Invoice</button>
        </div>
      </div>

      {/* DAILY REPORT MODAL */}
      {reportModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Daily Sales Report</h3>
              <button onClick={() => setReportModal(false)} style={{background: 'none', border:'none', fontSize: '1.5rem', cursor: 'pointer', color: '#c00026'}}>&times;</button>
            </div>
            <div>
              <div className="report-item">
                <span>Total Invoices Today:</span>
                <strong>{dailyReport.totalInvoices}</strong>
              </div>
              <div className="report-item">
                <span>Revenue Today:</span>
                <strong>₹{dailyReport.totalRevenue.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE A4 CONTENT (Hidden except print media) */}
      <div className="printable-invoice">
         <div className="print-header">
            <h1>TAX INVOICE</h1>
            <p>Your Awesome Printer Shop</p>
            <p>Phone: +91 9999999999 | Email: contact@shop.com</p>
         </div>
         <div className="print-details">
            <div>
              <strong>Bill To:</strong><br/>
              {name || "Walk-in Customer"}<br/>
              {phone}
            </div>
            <div>
              <strong>Date:</strong> {new Date().toLocaleDateString()}<br/>
            </div>
         </div>
         <table className="print-table">
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{p.name}</td>
                  <td>{p.quantity}</td>
                  <td>₹{Number(p.price).toFixed(2)}</td>
                  <td>₹{Number(p.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
         </table>
         <div className="print-totals">
            <div>Subtotal: ₹{subTotal.toFixed(2)}</div>
            <div className="print-grand">Grand Total: ₹{grandTotal.toFixed(2)}</div>
         </div>
         <div style={{marginTop: '50px', textAlign: 'center', color: '#555', fontSize: '10pt'}}>
           Thank you for your business!
         </div>
      </div>

    </div>
  );
};

export default Dashboard;
