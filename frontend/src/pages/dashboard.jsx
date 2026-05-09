import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import "./dashboard.css";
import "./dashboard-analytics.css";

/* ─── Sample data (replace with real API data later) ─── */
const DAILY_INVOICES = [
  { invNo: "INV-001", customer: "Al Noor Trading",    total: 530.00, vat: 25.24, grand: 555.24, payment: "Cash",   items: 3 },
  { invNo: "INV-002", customer: "Gulf Tech LLC",       total: 210.00, vat: 10.00, grand: 220.00, payment: "Cheque", items: 2 },
  { invNo: "INV-003", customer: "Bright Copy Centre",  total: 850.00, vat: 40.48, grand: 890.48, payment: "Cash",   items: 5 },
];

const MONTHLY_WEEKS = [
  { week: "Week 1", invoices: 12, revenue: 4820,  vat: 229.52 },
  { week: "Week 2", invoices: 18, revenue: 7340,  vat: 349.52 },
  { week: "Week 3", invoices: 15, revenue: 6100,  vat: 290.48 },
  { week: "Week 4", invoices: 22, revenue: 9210,  vat: 438.57 },
];

/* ─── Donut chart helper ─── */
const DonutChart = ({ segments, size = 180, stroke = 32, children }) => {
  const r     = (size - stroke) / 2;
  const circ  = 2 * Math.PI * r;
  const cx    = size / 2;
  const cy    = size / 2;

  let offset = 0;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", display:"block" }}>
      {/* background track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f0dfe4" strokeWidth={stroke} />
      {segments.map((seg, i) => {
        const dash = (seg.pct / 100) * circ;
        const el = (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-offset * circ / 100}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        );
        offset += seg.pct;
        return el;
      })}
      {children && (
        <foreignObject x={stroke/2} y={stroke/2} width={size-stroke} height={size-stroke}>
          <div style={{
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            width:"100%", height:"100%", transform:"rotate(90deg)"
          }}>
            {children}
          </div>
        </foreignObject>
      )}
    </svg>
  );
};

/* ─── Bar chart (monthly weeks) ─── */
const BarChart = ({ data, color = "#c00026" }) => {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="bar-chart">
      {data.map((d, i) => (
        <div key={i} className="bar-item">
          <div className="bar-wrap">
            <div
              className="bar-fill"
              style={{
                height: `${(d.value / max) * 100}%`,
                background: color,
                opacity: 0.7 + (i / data.length) * 0.3
              }}
            />
          </div>
          <div className="bar-label">{d.label}</div>
          <div className="bar-value">AED {d.value.toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════ */
const Dashboard = () => {
  const today = new Date().toLocaleDateString("en-AE", {
    weekday:"long", year:"numeric", month:"long", day:"numeric"
  });

  /* Daily calcs */
  const dayRevenue = DAILY_INVOICES.reduce((s, i) => s + i.grand, 0);
  const dayVat     = DAILY_INVOICES.reduce((s, i) => s + i.vat,   0);
  const dayItems   = DAILY_INVOICES.reduce((s, i) => s + i.items, 0);
  const cashAmt    = DAILY_INVOICES.filter(i => i.payment==="Cash").reduce((s,i)=>s+i.grand,0);
  const chequeAmt  = DAILY_INVOICES.filter(i => i.payment==="Cheque").reduce((s,i)=>s+i.grand,0);
  const cashPct    = Math.round((cashAmt / dayRevenue) * 100) || 0;
  const chequePct  = 100 - cashPct;

  /* Monthly calcs */
  const monRevenue = MONTHLY_WEEKS.reduce((s,w) => s + w.revenue, 0);
  const monVat     = MONTHLY_WEEKS.reduce((s,w) => s + w.vat,     0);
  const monInv     = MONTHLY_WEEKS.reduce((s,w) => s + w.invoices, 0);
  const maxWeek    = Math.max(...MONTHLY_WEEKS.map(w=>w.revenue));
  const week1Pct   = Math.round((MONTHLY_WEEKS[0].revenue / monRevenue)*100);
  const week2Pct   = Math.round((MONTHLY_WEEKS[1].revenue / monRevenue)*100);
  const week3Pct   = Math.round((MONTHLY_WEEKS[2].revenue / monRevenue)*100);
  const week4Pct   = 100 - week1Pct - week2Pct - week3Pct;

  return (
    <div className="page-layout">
      <Sidebar />

      <div className="page-main">

        {/* ── Header ── */}
        <div className="page-header">
          <div>
            <h2 className="page-title">Analytics Dashboard</h2>
            <p className="page-subtitle">{today}</p>
          </div>
          <div className="da-badge">👑 Admin View</div>
        </div>

        {/* ── Top stat cards ── */}
        <div className="da-stats-row">
          <div className="da-stat-card">
            <div className="da-stat-icon" style={{background:"#fff0f2",color:"#c00026"}}>💰</div>
            <div>
              <div className="da-stat-value">AED {dayRevenue.toFixed(2)}</div>
              <div className="da-stat-label">Today's Revenue</div>
            </div>
          </div>
          <div className="da-stat-card">
            <div className="da-stat-icon" style={{background:"#f0fff6",color:"#2a7d4f"}}>📦</div>
            <div>
              <div className="da-stat-value">{dayItems}</div>
              <div className="da-stat-label">Products Sold Today</div>
            </div>
          </div>
          <div className="da-stat-card">
            <div className="da-stat-icon" style={{background:"#fff8ed",color:"#d4820a"}}>🏛️</div>
            <div>
              <div className="da-stat-value">AED {dayVat.toFixed(2)}</div>
              <div className="da-stat-label">VAT Collected Today</div>
            </div>
          </div>
          <div className="da-stat-card">
            <div className="da-stat-icon" style={{background:"#f5f0ff",color:"#7c3aed"}}>📈</div>
            <div>
              <div className="da-stat-value">AED {monRevenue.toLocaleString()}</div>
              <div className="da-stat-label">Monthly Revenue</div>
            </div>
          </div>
        </div>

        {/* ── Charts row ── */}
        <div className="da-charts-row">

          {/* Daily donut */}
          <div className="da-chart-card">
            <div className="da-chart-title">
              📅 Daily Payment Split
              <span className="da-chart-sub">Today's invoices</span>
            </div>

            <div className="da-donut-wrap">
              <DonutChart
                size={180} stroke={30}
                segments={[
                  { pct: cashPct,   color: "#c00026" },
                  { pct: chequePct, color: "#edb9c7" },
                ]}
              >
                <div style={{fontWeight:700,fontSize:22,color:"#c00026",lineHeight:1}}>{DAILY_INVOICES.length}</div>
                <div style={{fontSize:11,color:"#999",marginTop:2}}>Invoices</div>
              </DonutChart>

              <div className="da-legend">
                <div className="da-legend-item">
                  <span className="da-dot" style={{background:"#c00026"}}/>
                  <div>
                    <div className="da-leg-label">Cash</div>
                    <div className="da-leg-val">AED {cashAmt.toFixed(2)} <em>({cashPct}%)</em></div>
                  </div>
                </div>
                <div className="da-legend-item">
                  <span className="da-dot" style={{background:"#edb9c7"}}/>
                  <div>
                    <div className="da-leg-label">Cheque</div>
                    <div className="da-leg-val">AED {chequeAmt.toFixed(2)} <em>({chequePct}%)</em></div>
                  </div>
                </div>
                <div className="da-legend-item">
                  <span className="da-dot" style={{background:"#f5f0ff"}}/>
                  <div>
                    <div className="da-leg-label">Items Sold</div>
                    <div className="da-leg-val">{dayItems} products</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly donut */}
          <div className="da-chart-card">
            <div className="da-chart-title">
              📆 Monthly Week Breakdown
              <span className="da-chart-sub">{monInv} invoices this month</span>
            </div>

            <div className="da-donut-wrap">
              <DonutChart
                size={180} stroke={30}
                segments={[
                  { pct: week1Pct, color: "#c00026" },
                  { pct: week2Pct, color: "#e07090" },
                  { pct: week3Pct, color: "#edb9c7" },
                  { pct: week4Pct, color: "#f5d5df" },
                ]}
              >
                <div style={{fontWeight:700,fontSize:20,color:"#c00026",lineHeight:1}}>
                  {monInv}
                </div>
                <div style={{fontSize:11,color:"#999",marginTop:2}}>Total Inv.</div>
              </DonutChart>

              <div className="da-legend">
                {MONTHLY_WEEKS.map((w, i) => {
                  const colors = ["#c00026","#e07090","#edb9c7","#f5d5df"];
                  const pcts   = [week1Pct, week2Pct, week3Pct, week4Pct];
                  return (
                    <div key={i} className="da-legend-item">
                      <span className="da-dot" style={{background: colors[i]}}/>
                      <div>
                        <div className="da-leg-label">{w.week} — {w.invoices} inv.</div>
                        <div className="da-leg-val">AED {w.revenue.toLocaleString()} <em>({pcts[i]}%)</em></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Monthly bar chart */}
          <div className="da-chart-card da-bar-card">
            <div className="da-chart-title">
              📊 Monthly Revenue Bars
              <span className="da-chart-sub">Week-by-week breakdown</span>
            </div>
            <BarChart
              data={MONTHLY_WEEKS.map(w => ({ label: w.week, value: w.revenue }))}
              color="#c00026"
            />
            <div className="da-bar-total">
              Total: <strong>AED {monRevenue.toLocaleString()}</strong>
              &nbsp;·&nbsp; VAT: <strong>AED {monVat.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        {/* ── Recent Invoices ── */}
        <div className="card">
          <div className="da-table-header">
            <h3 className="products-heading" style={{margin:0}}>📋 Today's Invoices</h3>
            <span className="da-inv-count">{DAILY_INVOICES.length} records</span>
          </div>
          <div className="table-scroll" style={{marginTop:14}}>
            <table className="products-table">
              <thead>
                <tr>
                  <th>Inv. No</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Without VAT</th>
                  <th>VAT (5%)</th>
                  <th>Grand Total</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {DAILY_INVOICES.map((inv, i) => (
                  <tr key={i}>
                    <td style={{fontWeight:600,color:"#c00026"}}>{inv.invNo}</td>
                    <td>{inv.customer}</td>
                    <td style={{textAlign:"center"}}>{inv.items}</td>
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
              <tfoot>
                <tr style={{background:"#fce4ec",fontWeight:700}}>
                  <td colSpan={2}>Total</td>
                  <td style={{textAlign:"center"}}>{dayItems}</td>
                  <td>AED {DAILY_INVOICES.reduce((s,i)=>s+i.total,0).toFixed(2)}</td>
                  <td>AED {dayVat.toFixed(2)}</td>
                  <td>AED {dayRevenue.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;