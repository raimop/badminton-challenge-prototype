const { Schema, model } = require('mongoose');

const rankingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  points: { type: Number, default: 1000 },
  joined: { type: Date, default: Date.now },
  category: { type: String, required: true },
})

const Ranking = model("Ranking", rankingSchema);

module.exports = Ranking;