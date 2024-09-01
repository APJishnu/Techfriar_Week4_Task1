const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  field: { type: String, required: true },
  value: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '1m' } // TTL index set to 1 minute
});

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
