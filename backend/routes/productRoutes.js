const router = require("express").Router();

const {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const auth = require("../middleware/authMiddleware");

// CREATE PRODUCT
router.post("/", auth, createProduct);

// GET ALL PRODUCTS
router.get("/", auth, getProducts);

// GET SINGLE PRODUCT
router.get("/:id", auth, getSingleProduct);

// UPDATE PRODUCT
router.put("/:id", auth, updateProduct);

// DELETE PRODUCT
router.delete("/:id", auth, deleteProduct);

module.exports = router;