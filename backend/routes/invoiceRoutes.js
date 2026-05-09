const router = require("express").Router();
const { createInvoice, getInvoices } = require("../controllers/invoiceController");
const auth = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/authMiddleware");

router.post("/", auth, createInvoice);
router.get("/", auth, requireRole("admin"), getInvoices);

module.exports = router;
