const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes"); 
const orderRoutes = require("./routes/orderRoutes.js");
const addressRoutes = require("./routes/addressRoutes.js");




dotenv.config();
connectDB();

const app = express();
app.use(cors());
// app.use(cors({
//   origin: "http://localhost:5173", 
//   credentials: true,
// }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/address", addressRoutes);

app.get("/api", (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
