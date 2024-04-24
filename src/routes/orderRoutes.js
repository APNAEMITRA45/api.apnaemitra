const express = require("express");
const {
  getOrders,
  setOrder,
  deleteOrder,
  updateOrderStatus,
  setOtps,
  orderId,
  getOrder,
} = require("../controllers/orderControllers.js");

const router = express.Router();
//for mobile
router.get("/get-orders", getOrders);
router.get("/get-order", getOrder);
router.post("/set-order", setOrder);
router.post("/update-order-status", updateOrderStatus);
router.delete("/delete-order/:orderId", deleteOrder);
router.post("/set-otps", setOtps);
//For Razorpay order
router.post("/order-id", orderId);

module.exports = router;
