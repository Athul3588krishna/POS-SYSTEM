import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const readSession = () => {
  try {
    return JSON.parse(localStorage.getItem("pos-session")) || null;
  } catch {
    return null;
  }
};

function App() {
  const [session, setSession] = useState(readSession);
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const request = useCallback(
    async (path, options = {}) => {
      const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
          ...options.headers
        }
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      return data;
    },
    [session]
  );

  const loadData = useCallback(async () => {
    if (!session?.token) return;

    setLoading(true);
    setError("");

    try {
      const invoiceRequest = session.user?.role === "admin"
        ? request("/invoices")
        : Promise.resolve([]);
      const [productData, invoiceData] = await Promise.all([
        request("/products"),
        invoiceRequest
      ]);
      setProducts(productData);
      setInvoices(invoiceData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [request, session]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLogin = async (mode, form) => {
    const body = mode === "register"
      ? form
      : { email: form.email, password: form.password, role: form.role };
    const data = await fetch(`${API_URL}/auth/${mode === "register" ? "register" : "login"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(async (response) => {
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || "Authentication failed");
      return payload;
    });

    localStorage.setItem("pos-session", JSON.stringify(data));
    setSession(data);
  };

  const logout = () => {
    localStorage.removeItem("pos-session");
    setSession(null);
    setProducts([]);
    setInvoices([]);
  };

  const createProduct = async (payload) => {
    setError("");
    await request("/products", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    await loadData();
  };

  const updateProduct = async (id, payload) => {
    setError("");
    const updated = await request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
    setProducts((current) =>
      current.map((product) => (product._id === id ? updated : product))
    );
  };

  const deleteProduct = async (id) => {
    setError("");
    await request(`/products/${id}`, { method: "DELETE" });
    setProducts((current) => current.filter((product) => product._id !== id));
  };

  const createInvoice = async (payload) => {
    setError("");
    const invoice = await request("/invoices", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    await loadData();
    return invoice;
  };

  if (!session?.token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      {error && <div className="app-error">{error}</div>}
      {loading && <div className="loading-bar">Loading...</div>}
      <Dashboard
        user={session.user}
        products={products}
        invoices={invoices}
        onLogout={logout}
        onCreateProduct={createProduct}
        onUpdateProduct={updateProduct}
        onDeleteProduct={deleteProduct}
        onCreateInvoice={createInvoice}
      />
    </>
  );
}

export default App;
