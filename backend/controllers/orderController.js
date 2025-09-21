// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js"
// import Stripe from "stripe"


// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


// //Placing user order from Frontend

// const placeOrder = async (req,res) =>{

//     const frontend_url = "http://localhost:5173/";

//     try {
//         const newOrder = new orderModel({
//             userId:req.body.userId,
//             items:req.body.items,
//             amount:req.body.amount,
//             address:req.body.address,
//         })
//         await newOrder.save();
//         await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}})

//         const line_items = req.body.items.map((item)=>({
//             price_data:{
//                 currency:"aus",
//                 product_data:{
//                     name:item.name
//                 },
//                 unit_amount:item.price*100*80
//             },
//             quantity:item.quantity
//         }))

//         line_items.push({
//             price_data:{
//                 currency:"aus",
//                 product_data:{
//                     name:"Delivery Charges"
//                 },
//                 unit_amount:2*100*80
//             },
//             quantity:1
//         })

//         const session = await stripe.checkout.sessions.create({
//             line_items:line_items,
//             mode:'payment',
//             success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
//             cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`

//         })

//         res.json({success:true,success_url:session.url})

//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Error"})
        
//     }
// }



// const verifyOrder = async (req,res) => {
//     const {orderId,success} = req.body
//     try {
//         if (success=="true") {
//             await orderModel.findByIdAndUpdate(orderId,{payment:true});
//             res.json({success:true,message:"Paid"})
//         }
//         else{
//             await orderModel.findByIdAndDelete(orderId);
//             res.json({success:false,message:"Not Paid"})
//         }
//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Error"})
        
//     }
// }


// //User orders for frontend
// const userOrders = async(req,res) => {
//     try {
//         const orders = await orderModel.find({userId:req.body.userId});
//         res.json({success:true,data:orders})
//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Error"})
        
//     }
// }



// //Listing order for admin panel
// const listOrders = async (req,res) => {
//     try {
//         const orders = await orderModel.find({})
//         res.json({success:true,data:orders})

//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Error"})
        
//     }
// }


// export {placeOrder,verifyOrder,userOrders,listOrders}


import dotenv from "dotenv";
dotenv.config();

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
// import Razorpay from "razorpay";
import crypto from "crypto";

// ❌ Commenting Razorpay initialization
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET_KEY,
// });

// Placing user order from Frontend
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173/";

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

    // ❌ Commented Razorpay order creation
    // const options = {
    //   amount: totalAmount * 100,
    //   currency: "INR",
    //   receipt: `order_rcptid_${newOrder._id}`,
    // };
    // const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: newOrder._id,
      // razorpayOrderId: razorpayOrder.id,
      amount: totalAmount,
    });
  } catch (error) {
    console.error("Error in placeOrder:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Verifying Razorpay payment
const verifyOrder = async (req, res) => {
  // ❌ Entire Razorpay verify logic commented
  // const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } =
  //   req.body;

  try {
    // Simple fallback: auto-mark payment true (for testing)
    await orderModel.findByIdAndUpdate(req.body.orderId, { payment: true });
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


