import { useState } from "react";
import "./login.css";

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "staff"
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const fillDemo = (role) => {
    setForm({
      role,
      email: role === "admin" ? "admin@pos.com" : "staff@pos.com",
      password: role === "admin" ? "admin123" : "staff123"
    });
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await onLogin(form);
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-shell">
      <section className="login-brand">
        <img src="/logo.png" alt="POS Billing System" />
        <h1>POS Billing System</h1>
        <p>Products, VAT invoices, stock updates and sales history in one workspace.</p>
      </section>

      <section className="login-panel" aria-label="Authentication">
        <div className="login-title">
          <h2>Sign in</h2>
          <p>Use assigned admin or billing staff credentials.</p>
        </div>

        <form onSubmit={submit} className="login-form">
          <div className="role-switch" aria-label="Account role">
            <button
              className={form.role === "staff" ? "active" : ""}
              type="button"
              onClick={() => fillDemo("staff")}
            >
              Billing Staff
            </button>
            <button
              className={form.role === "admin" ? "active" : ""}
              type="button"
              onClick={() => fillDemo("admin")}
            >
              Admin
            </button>
          </div>

          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={updateField}
              autoComplete="current-password"
              required
            />
          </label>

          <div className="credential-help">
            <span>Admin: admin@pos.com / admin123</span>
            <span>Staff: staff@pos.com / staff123</span>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="primary-action" disabled={isLoading} type="submit">
            {isLoading ? "Please wait..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Login;
