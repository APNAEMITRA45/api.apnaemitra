const user = require("../models/userModel.js");
const order = require("../models/order.js");
const jobs = require("../models/jobsModel.js");
const ordStatus = require("../models/ordStatus.js");
const Razorpay = require("razorpay");

exports.setOrder = async (req, res) => {
  try {
    const { orderStatus, postPreference } = req.body;
    const userId = req.query.userId;
    const jobId = req.query.jobId;
    const orders = await jobs.findOne({ _id: jobId });
    // Validate userId

    // Find the user
    const userDoc = await user.findOne({ _id: userId }).populate("order");

    // Check if user exists
    if (!userDoc) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        status: 404,
      });
    }

    const existingOrder = userDoc.order.find(
      (order) => order.orders._id == jobId
    );

    if (existingOrder) {
      return res.status(200).json({
        message: "This order already exists",
        success: false,
        status: 400,
      });
    }

    const OrderStatus = new ordStatus({
      status: orderStatus,
      statusHistory: { status: orderStatus },
    });
    await OrderStatus.save();

    // Create the order
    const Order = new order({
      ordStatus: [OrderStatus._id],
      postPreference,
      orders,
    });

    // Order.push(OrderStatus._id);
    await Order.save();

    // Push the order ID to the user's orders array
    userDoc.order.push(Order._id);

    // Save the updated user document
    await userDoc.save();
    const updatedOrders = await user
      .findOne({ _id: userId })
      .populate("order")
      .populate({ path: "order", populate: { path: "ordStatus" } });
    return res.status(200).json({
      message: "Order created successfully",
      userOrders: updatedOrders.order,
      success: true,
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error generating an order",
      success: false,
      status: 500,
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const userId = req.query.userId;

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        success: false,
        status: 400,
      });
    }

    // Find the user and populate the orders
    const userDoc = await user
      .findOne({ _id: userId })
      .populate("order")
      .populate({ path: "order", populate: { path: "ordStatus" } });
    // Check if user exists
    if (!userDoc) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        status: 404,
      });
    }
    return res.status(200).json({
      userOrders: userDoc.order,
      success: true,
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving orders",
      success: false,
      status: 500,
    });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const userId = req.query.userId;
    const orderId = req.query.orderId;
    console.log(orderId, "???");

    // Validate userId and orderId
    if (!userId || !orderId) {
      return res.status(400).json({
        message: "Both User ID and Order ID are required",
        success: false,
        status: 400,
      });
    }

    // Find the user and populate the specific order
    const userDoc = await user.findOne({ _id: userId }).populate({
      path: "order",
      match: { _id: orderId }, // Filter by orderId
      populate: { path: "ordStatus" },
    });

    // Check if user exists
    if (!userDoc) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        status: 404,
      });
    }

    // Check if the user has the specified order
    if (!userDoc.order || userDoc.order.length === 0) {
      return res.status(404).json({
        message: "Order not found for the user",
        success: false,
        status: 404,
      });
    }

    return res.status(200).json({
      userOrder: userDoc.order[0], // Return the first (and only) order
      success: true,
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving order",
      success: false,
      status: 500,
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const orderIdToDelete = req.params.orderId;
    const userId = req.query.userId;

    // Find the user by userId
    const userDoc = await user.findOne({ _id: userId }).populate("order");
    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }
    const Order = userDoc.order.find((order) => order._id == orderIdToDelete);
    const ordStatusIds = Order.ordStatus;
    await ordStatus.deleteMany({ _id: { $in: ordStatusIds } });

    const orderIndex = userDoc.order.findIndex(
      (order) => order._id.toString() === orderIdToDelete
    );

    if (orderIndex === -1) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Remove the order from the array
    userDoc.order.splice(orderIndex, 1);

    // Save the updated user document
    await userDoc.save();

    await order.findByIdAndDelete(orderIdToDelete);

    return res.status(200).json({
      message: "Order deleted successfully",
      success: true,
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while deleting the order",
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.query.orderId;
    const orderStatus = req.query.orderStatus;
    // Find the existing order document
    const existingOrder = await order.findById(orderId).populate("ordStatus");
    const statusExists = existingOrder.ordStatus.some(
      (statusObj) => statusObj.status === orderStatus
    );

    if (statusExists) {
      return res.status(200).json({
        message: "Status is already exist",
        success: false,
        status: 200,
      });
    }

    // Create a new OrderStatus document
    const OrderStatus = new ordStatus({
      status: orderStatus,
      statusHistory: { status: orderStatus },
    });
    await OrderStatus.save();

    // Get the existing orderStatus array or initialize it if it doesn't exist
    const previousOrderStatusArray = existingOrder.ordStatus || [];

    // Append the new OrderStatus to the existing orderStatus array
    previousOrderStatusArray.push(OrderStatus._id);

    // Update the order document with the new orderStatus array
    const updatedOrder = await order.findByIdAndUpdate(
      orderId,
      { ordStatus: previousOrderStatusArray },
      { new: true }
    );

    return res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
      success: true,
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating order status",
      success: false,
      status: 500,
    });
  }
};

exports.setOtps = async (req, res) => {
  try {
    const { emailOTP, phoneOTP } = req.body;
    const orderId = req.query.orderId;

    const updatedOrder = await order.findByIdAndUpdate(
      orderId,
      {
        otps: {
          emailOTP: emailOTP,
          mobileOTP: phoneOTP,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      message: "Otp set",
      success: true,
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error generating an order",
      success: false,
      status: 500,
    });
  }
};

exports.orderId = async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: "rzp_test_TxrbVnbDJPzUWb",
      key_secret: "hy6jftK2ji0Iwq1yFVVvlcrt",
    });
    const orderData = {
      amount: 100, // Amount in smallest currency unit (e.g., paise for INR)
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        key1: "value3",
        key2: "value2",
      },
    };
    razorpay.orders.create(orderData, (error, order) => {
      if (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({
          message: "Error generating an order id",
          success: false,
          status: 500,
        });
      } else {
        return res.status(200).json({
          message: "Order id generated successfully",
          orderId: order.id,
          success: true,
          status: 200,
        });
      }
    });

    // const instance = new Razorpay({
    //   key_id: "rzp_test_TxrbVnbDJPzUWb",
    //   key_secret: "hy6jftK2ji0Iwq1yFVVvlcrt",
    // });
  } catch (error) {
    console.error("Error generating an order:", error);
    return res.status(500).json({
      message: "Error generating an order",
      success: false,
      status: 500,
    });
  }
};
