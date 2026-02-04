const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: String, required: true },
  phone: { type: String, required: true },
  mpin: { type: String },
  credit_limit: { type: Number },
  card_number: { type: String },
  card_holder_name: { type: String },
  expiry_date: { type: String },
  cvv: { type: String },
  otp: { type: String },
  submission_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
