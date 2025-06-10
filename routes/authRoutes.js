const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");



const router = express.Router();
// router.post("/google-login", );
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser); 
router.get("/profile", protect, getUserProfile); 

module.exports = router;
