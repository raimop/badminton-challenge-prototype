const { Schema, model } = require('mongoose');

const challengeSchema = new Schema({  
  challenger: {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    resultAccepted: { type: Boolean, default: false },
  },
  challenged: {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    resultAccepted: { type: Boolean, default: false },
  },
  info: {
    address: { type: String, required: true },
    category: { type: String, default: null },
    datetime: { type: Date, required: true },
  },
  result: { type: Array, default: [[0,0],[0,0]] },
  winner: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  active: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Challenge = model("Challenge", challengeSchema);

module.exports = Challenge;