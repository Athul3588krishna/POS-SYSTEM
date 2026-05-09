import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import StaffDashboard from "./pages/staffdashboard";
import DailyReport from "./pages/dailyReport";
import MonthlyReport from "./pages/monthlyReport";

// ── Protected Route ──────────────────────────────────
const ProtectedRoute = ({ children, allowedRoles }) => {
  const role      = localStorage.getItem("userRole");
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (!isLoggedIn) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(role))
    return <Navigate to="/unauthorized" replace />;
  return children;
};

// ── Unauthorized page ────────────────────────────────
const Unauthorized = () => (
  <div style={{
    display:"flex", alignItems:"center", justifyContent:"center",
    minHeight:"100vh", background:"#f7f3f4", fontFamily:"DM Sans,sans-serif",
    padding:"20px"
  }}>
    <div style={{
      background:"#fff", padding:"48px 40px", borderRadius:"20px",
      boxShadow:"0 8px 40px rgba(192,0,38,0.10)", textAlign:"center",
      maxWidth:380, width:"100%"
    }}>
      <div style={{fontSize:52, marginBottom:18}}>🚫</div>
      <h2 style={{color:"#c00026", marginBottom:10, fontSize:22, fontWeight:700}}>
        Access Denied
      </h2>
      <p style={{color:"#888", marginBottom:30, fontSize:14, lineHeight:1.6}}>
        You don't have permission to view this page.
      </p>
      <button
        onClick={() => {
          const role = localStorage.getItem("userRole");
          window.location.href = role === "admin" ? "/dashboard" : "/invoice";
        }}
        style={{
          background:"linear-gradient(135deg,#edb9c7,#e0a3b5)",
          color:"#fff", border:"none", padding:"12px 32px",
          borderRadius:"10px", fontWeight:600, cursor:"pointer",
          fontSize:14, boxShadow:"0 4px 14px rgba(237,185,199,0.5)",
          fontFamily:"DM Sans,sans-serif"
        }}
      >
        ← Go Back
      </button>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/monthly-report" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <MonthlyReport />
          </ProtectedRoute>
        } />
        <Route path="/invoice" element={
          <ProtectedRoute allowedRoles={["admin","staff"]}>
            <StaffDashboard />
          </ProtectedRoute>
        } />
        <Route path="/daily-report" element={
          <ProtectedRoute allowedRoles={["admin","staff"]}>
            <DailyReport />
          </ProtectedRoute>
        } />

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;