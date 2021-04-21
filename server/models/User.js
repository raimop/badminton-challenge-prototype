const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: {
    showHistory: { type: Boolean, default: true },
    emailNotif: { type: Boolean, default: true }
  },
  status: { type: String, enum: ['pending', 'active'], default: 'pending' },
  confirmationCode: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const User = model("User", userSchema);

module.exports = User;