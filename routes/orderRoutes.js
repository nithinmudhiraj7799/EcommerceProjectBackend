const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/", protect, admin, getAllOrders); 
router.put("/:id/status", protect, admin, updateOrderStatus); 

module.exports = router;
