import { useState } from "react";
import "./login.css";

const Login = ({ onLogin }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
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

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await onLogin(mode, form);
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
        <div className="mode-switch">
          <button
            className={mode === "login" ? "active" : ""}
            type="button"
            onClick={() => setMode("login")}
          >
            Sign in
          </button>
          <button
            className={mode === "register" ? "active" : ""}
            type="button"
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        <form onSubmit={submit} className="login-form">
          <div className="role-switch" aria-label="Account role">
            <button
              className={form.role === "staff" ? "active" : ""}
              type="button"
              onClick={() => setForm((current) => ({ ...current, role: "staff" }))}
            >
              Billing Staff
            </button>
            <button
              className={form.role === "admin" ? "active" : ""}
              type="button"
              onClick={() => setForm((current) => ({ ...current, role: "admin" }))}
            >
              Admin
            </button>
          </div>

          {mode === "register" && (
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                autoComplete="name"
                required
              />
            </label>
          )}

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
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button className="primary-action" disabled={isLoading} type="submit">
            {isLoading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Login;
