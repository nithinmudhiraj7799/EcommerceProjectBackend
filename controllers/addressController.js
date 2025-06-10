const Address = require("../models/Address");

const saveAddress = async (req, res) => {
  try {
    const existing = await Address.findOne({ user: req.user._id });

    if (existing) {
      const updated = await Address.findOneAndUpdate({ user: req.user._id }, req.body, { new: true });
      return res.status(200).json(updated);
    }

    const newAddress = new Address({
      user: req.user._id,
      ...req.body,
    });

    const saved = await newAddress.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Failed to save address" });
  }
};

const getAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ user: req.user._id });
    res.status(200).json(address);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch address" });
  }
};

module.exports = { saveAddress, getAddress };
