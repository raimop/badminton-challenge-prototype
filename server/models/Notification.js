const { Schema, model } = require('mongoose');

const notificationSchema = new Schema({
  to: { type: Schema.Types.ObjectId, ref: 'User' },
  challenge: { type: Schema.Types.ObjectId, ref: 'Challenge', required: false, default: null },
  content: { type: String, required: true },
  read: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
})

const Notification = model("Notification", notificationSchema);

module.exports = Notification;