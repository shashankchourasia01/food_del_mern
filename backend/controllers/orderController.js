import dotenv from "dotenv";
dotenv.config();

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
// import Razorpay from "razorpay";
import crypto from "crypto";

// ❌ Razorpay initialization commented out
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET_KEY,
// });

// Placing user order from Frontend
const placeOrder = async (req, res) => {
  // local frontend (kept commented) and live frontend URL used in response
  // const frontend_url = "http://localhost:5173/";
  const frontend_url_live = "https://food-delivery-app-zcve.onrender.com/";

  try {
    const { userId, items, amount, address } = req.body;

    if (!userId || !items || !amount || !address) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input data" });
    }

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
    });
    await newOrder.save();

    // Clear user cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const totalAmount =
      items.reduce((acc, item) => acc + item.price * item.quantity, 0) + 2 * 80;

    // ❌ Razorpay order creation removed/commented out
    // const options = {
    //   amount: totalAmount * 100,
    //   currency: "INR",
    //   receipt: `order_rcptid_${newOrder._id}`,
    // };
    // const razorpayOrder = await razorpay.orders.create(options);

    // Provide frontend URLs for success/cancel so frontend can continue same flow
    const successUrl = `${frontend_url_live}verify?success=true&orderId=${newOrder._id}`;
    const cancelUrl = `${frontend_url_live}verify?success=false&orderId=${newOrder._id}`;

    res.json({
      success: true,
      orderId: newOrder._id,
      // razorpayOrderId: razorpayOrder?.id,
      amount: totalAmount,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
  } catch (error) {
    console.error("Error in placeOrder:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Verifying Razorpay payment (Razorpay logic commented out)
// For now we auto-mark payment as true when verify endpoint is called
const verifyOrder = async (req, res) => {
  // Previously expected:
  // const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input data" });
    }

    // Mark payment true (testing fallback since Razorpay is disabled)
    await orderModel.findByIdAndUpdate(orderId, { payment: true });
    res.json({ success: true, message: "Payment Skipped (Razorpay Disabled)" });
  } catch (error) {
    console.error("Error in verifyOrder:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// User orders for frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input data" });
    }

    const orders = await orderModel.find({ userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error in userOrders:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error in listOrders:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// API for updating order status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
