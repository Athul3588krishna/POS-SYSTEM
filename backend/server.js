require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || true,
  credentials: true
}));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/invoices", require("./routes/invoiceRoutes"));

const frontendDist = path.join(__dirname, "..", "frontend", "dist");

app.use(express.static(frontendDist));

app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    return res.sendFile(path.join(frontendDist, "index.html"));
  }

  next();
});

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
});
