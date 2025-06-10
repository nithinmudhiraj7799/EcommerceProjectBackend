const express = require("express");
const router = express.Router();
const { saveAddress, getAddress } = require("../controllers/addressController");
const { protect } = require("../middleware/authMiddleware");

router.post("/save", protect, saveAddress);
router.get("/my", protect, getAddress);

module.exports = router;
