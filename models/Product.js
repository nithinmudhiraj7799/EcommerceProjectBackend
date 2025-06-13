const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },          
  description: { type: String },                               
  price: { type: Number, required: true },                     
  category: { type: String, required: true },                   
  image: { type: String },                                     
  countInStock: { type: String, default: 0 },                  
  rating: { type: Number, default: 0 },                         
  numReviews: { type: Number, default: 0 },                 
}, { timestamps: true });                                      

module.exports = mongoose.model("Product", productSchema);
