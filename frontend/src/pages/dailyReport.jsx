import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import "./dashboard.css";

const DailyReport = () => {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const invoices = [
    { invNo:"INV-001", customer:"Al Noor Trading",   total:530.00, vat:25.24,  grand:555.24, payment:"Cash"   },
    { invNo:"INV-002", customer:"Gulf Tech LLC",      total:210.00, vat:10.00,  grand:220.00, payment:"Cheque" },
    { invNo:"INV-003", customer:"Bright Copy Centre", total:850.00, vat:40.48,  grand:890.48, payment:"Cash"   },
  ];

  const totalRevenue = invoices.reduce((s,i)=>s+i.grand,0);
  const totalVat     = invoices.reduce((s,i)=>s+i.vat,0);

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <div className="page-header">
          <div>
            <h2 className="page-title">Daily Report</h2>
            <p className="page-subtitle">All invoices issued on the selected date</p>
          </div>
          <input type="date" value={selectedDate}
            onChange={(e)=>setSelectedDate(e.target.value)}
            style={{padding:"9px 14px", border:"1.5px solid #e8e0e2",
              borderRadius:"8px", fontSize:13, fontFamily:"DM Sans,sans-serif",
              outline:"none"}}/>
        </div>

        <div className="stats-grid" style={{marginBottom:16}}>
          <div className="stat-card">
            <div className="stat-icon" style={{background:"#fff0f2",color:"#c00026"}}>🧾</div>
            <div><div className="stat-value">{invoices.length}</div><div className="stat-label">Invoices</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{background:"#f0fff6",color:"#2a7d4f"}}>💰</div>
            <div><div className="stat-value">AED {totalRevenue.toFixed(2)}</div><div className="stat-label">Total Revenue</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{background:"#fff8ed",color:"#d4820a"}}>🏛️</div>
            <div><div className="stat-value">AED {totalVat.toFixed(2)}</div><div className="stat-label">VAT Collected</div></div>
          </div>
        </div>

        <div className="card">
          <div className="table-scroll">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Inv. No</th><th>Customer</th><th>Without VAT</th>
                  <th>VAT (5%)</th><th>Grand Total</th><th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv,i)=>(
                  <tr key={i}>
                    <td style={{fontWeight:600,color:"#c00026"}}>{inv.invNo}</td>
                    <td>{inv.customer}</td>
                    <td>AED {inv.total.toFixed(2)}</td>
                    <td>AED {inv.vat.toFixed(2)}</td>
                    <td style={{fontWeight:700}}>AED {inv.grand.toFixed(2)}</td>
                    <td>
                      <span style={{
                        background: inv.payment==="Cash"?"#f0fff6":"#f0f4ff",
                        color:      inv.payment==="Cash"?"#2a7d4f":"#3a5fd9",
                        padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600
                      }}>{inv.payment}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReport;