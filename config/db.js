const mongoose = require("mongoose");
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://nithin:nithin@cluster0.ehei5qa.mongodb.net/nithin_Ecommerce?retryWrites=true&w=majority&appName=Cluster0");
    console.log("MongoDB connected successfully to nithin_Ecommerce");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};

module.exports = connectDB;
