const Order = require("../models/Order");

// Create a new order

const placeOrder = async (req, res) => {
  const { items, address } = req.body;

  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    const order = new Order({
      user: req.user._id,
      items,
      address,
    });

    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("❌ Order Save Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};


// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (error) {
    console.error(" Error updating status:", error.message);
    res.status(500).json({ message: error.message });
  }
};


// Get logged-in user's orders
const getMyOrders = async (req, res) => {
  try {
        console.log("Authenticated user:", req.user); // Add this line

    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .populate("address"); 
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("items.product")
      .populate("address");  
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { placeOrder, getMyOrders, getAllOrders ,updateOrderStatus};
