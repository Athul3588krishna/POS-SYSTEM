import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    
    setTimeout(() => {
      setIsLoading(false);
      // Single Admin Login per requirements
      if (username === "admin" && password === "admin") {
        navigate("/dashboard");
      } else {
        setErrorMsg("Invalid username or password");
      }
    }, 1000);
  };

  return (
    <div className="login-wrapper">

      {/* LEFT SIDE — Branding */}
      <div className="login-left">
        <div className="left-bg-decor" />
        <div className="left-bg-decor2" />

        <div className="branding">
          <div className="logo-ring">
            <div className="logo-circle">
              <img src="/logo.png" alt="POS Logo" />
            </div>
          </div>

          <h1 className="brand-title">POS Billing System</h1>
          <p className="brand-sub">Professional Invoice Management</p>

          <div className="brand-badges">
            <span className="badge">⚡ Fast Billing</span>
            <span className="badge">🧾 Tax Invoices</span>
            <span className="badge">📊 Reports</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE — Login Form */}
      <div className="login-right">
        <div className="login-card">

          {/* Card Header */}
          <div className="card-header">
            <div className="header-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="card-title">TAX INVOICE</h2>
            <p className="card-sub">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="login-form" noValidate>

            {errorMsg && <div style={{color: '#c00026', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center'}}>{errorMsg}</div>}

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
               {/* <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg> */}
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper password-wrapper">
                {/* <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg> */}
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
             {/* <a href="#" className="forgot-link">Forgot password?</a> */}
            </div>

            <button type="submit" className={`login-btn ${isLoading ? "loading" : ""}`} disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner" />
                  Signing in...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" className="btn-icon">
                    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Sign In
                </>
              )}
            </button>

          </form>

          <p className="card-footer">
            Secure login powered by <strong>POS Billing</strong>
          </p>

        </div>
      </div>

    </div>
  );
};

export default Login;