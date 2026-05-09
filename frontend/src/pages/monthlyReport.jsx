import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import "./dashboard.css";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const MonthlyReport = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year,  setYear]  = useState(now.getFullYear());

  const weeklyData = [
    { week:"Week 1", invoices:12, revenue:4820,  vat:229.52 },
    { week:"Week 2", invoices:18, revenue:7340,  vat:349.52 },
    { week:"Week 3", invoices:15, revenue:6100,  vat:290.48 },
    { week:"Week 4", invoices:22, revenue:9210,  vat:438.57 },
  ];

  const totRevenue = weeklyData.reduce((s,w)=>s+w.revenue,0);
  const totVat     = weeklyData.reduce((s,w)=>s+w.vat,0);
  const totInv     = weeklyData.reduce((s,w)=>s+w.invoices,0);

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <div className="page-header">
          <div>
            <h2 className="page-title">
              Monthly Report
              <span style={{
                marginLeft:10, fontSize:11, background:"#fff0f2",
                color:"#c00026", padding:"3px 9px", borderRadius:20,
                fontWeight:600, verticalAlign:"middle"
              }}>Admin Only</span>
            </h2>
            <p className="page-subtitle">Full monthly analytics and breakdown</p>
          </div>
          <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
            <select value={month} onChange={(e)=>setMonth(Number(e.target.value))}
              style={{padding:"9px 12px", border:"1.5px solid #e8e0e2",
                borderRadius:"8px", fontSize:13, fontFamily:"DM Sans,sans-serif", outline:"none"}}>
              {MONTHS.map((m,i)=><option key={i} value={i}>{m}</option>)}
            </select>
            <select value={year} onChange={(e)=>setYear(Number(e.target.value))}
              style={{padding:"9px 12px", border:"1.5px solid #e8e0e2",
                borderRadius:"8px", fontSize:13, fontFamily:"DM Sans,sans-serif", outline:"none"}}>
              {[2023,2024,2025,2026].map((y)=><option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div className="stats-grid" style={{marginBottom:16}}>
          <div className="stat-card">
            <div className="stat-icon" style={{background:"#fff0f2",color:"#c00026"}}>🧾</div>
            <div><div className="stat-value">{totInv}</div><div className="stat-label">Total Invoices</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{background:"#f0fff6",color:"#2a7d4f"}}>💰</div>
            <div><div className="stat-value">AED {totRevenue.toLocaleString()}</div><div className="stat-label">Total Revenue</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{background:"#fff8ed",color:"#d4820a"}}>🏛️</div>
            <div><div className="stat-value">AED {totVat.toFixed(2)}</div><div className="stat-label">VAT Collected</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{background:"#f5f0ff",color:"#7c3aed"}}>📈</div>
            <div>
              <div className="stat-value">AED {(totRevenue/weeklyData.length).toFixed(0)}</div>
              <div className="stat-label">Avg. Weekly Rev.</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="products-heading">{MONTHS[month]} {year} — Weekly Breakdown</h3>
          <div className="table-scroll">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Period</th><th>Invoices</th><th>Revenue (AED)</th>
                  <th>VAT (AED)</th><th>Grand Total (AED)</th>
                </tr>
              </thead>
              <tbody>
                {weeklyData.map((w,i)=>(
                  <tr key={i}>
                    <td style={{fontWeight:600}}>{w.week}</td>
                    <td>{w.invoices}</td>
                    <td>{w.revenue.toLocaleString()}</td>
                    <td>{w.vat.toFixed(2)}</td>
                    <td style={{fontWeight:700}}>{(w.revenue+w.vat).toFixed(2)}</td>
                  </tr>
                ))}
                <tr style={{background:"#fce4ec",fontWeight:700}}>
                  <td>Total</td>
                  <td>{totInv}</td>
                  <td>{totRevenue.toLocaleString()}</td>
                  <td>{totVat.toFixed(2)}</td>
                  <td>{(totRevenue+totVat).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport;