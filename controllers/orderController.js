const Order = require("../models/Order");
const Product = require("../models/Product");
const Address = require("../models/Address");
const { sendOrderSuccessEmail } = require("../services/emailService");
const { generateInvoicePDF } = require("../utils/pdfGenerator");

const placeOrder = async (req, res) => {
  try {
    const { items, address: addressId } = req.body;
    const userId = req.user._id;

    // ✅ Validate address
    const addressExists = await Address.findById(addressId);
    if (!addressExists) {
      return res.status(400).json({ message: "Invalid address ID" });
    }

    // ✅ Validate items and build properly
    const validatedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) throw new Error(`Product not found: ${item.product}`);
        return {
          product: product._id, // store as ref
          quantity: item.quantity,
        };
      })
    );

    // ✅ Create and save order
    const newOrder = await Order.create({
      user: userId,
      items: validatedItems,
      address: addressId,
    });

    // ✅ Populate the order with user, product, and address info
    const populatedOrder = await Order.findById(newOrder._id)
      .populate("items.product")
      .populate("address")
      .populate("user", "email");

    console.log("✅ Populated Email:", populatedOrder?.user?.email);

    // ✅ Generate PDF
    const fileName = `invoice-${populatedOrder._id}.pdf`;
    await generateInvoicePDF(populatedOrder, fileName);

    // ✅ Send Email
    await sendOrderSuccessEmail(populatedOrder.user.email, populatedOrder);

    res.status(201).json({
      message: "Order placed and email sent",
      order: populatedOrder,
    });

  } catch (error) {
    console.error("❌ Order placement failed:", error);
    res.status(500).json({ message: "Order failed", error: error.message });
  }
};


// ✅ Update order status (admin only)
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
    console.error("❌ Error updating status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get logged-in user's orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product"); // only if it's a ref

    res.json(orders);
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("items.product"); // only if product is a ref

    res.json(orders);
  } catch (error) {
    console.error("❌ Error fetching all orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
