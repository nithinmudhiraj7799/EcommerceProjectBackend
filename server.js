const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes"); 
const orderRoutes = require("./routes/orderRoutes.js");
const addressRoutes = require("./routes/addressRoutes.js");
const notificationRoutes = require("./routes/notificationRoutes");
const invoiceRoutes = require("./routes/pdfRoutes.js");







dotenv.config();
connectDB()

const app = express();

const allowedOrigins = [
      "https://ecommerce-project-frontend-beta.vercel.app",
  "http://localhost:5173",

];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use("/invoices", express.static(path.join(__dirname, "invoices")));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api", invoiceRoutes);

app.get("/api", (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
