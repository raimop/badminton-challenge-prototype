const Ranking = require('../models/Ranking');
const Notification = require('../models/Notification');

exports.filter = ["-email", "-password", "-createdAt", "-__v"]

exports.updatePoints = async ({ winner, loser }) => {
  await Promise.all([
    await Ranking.findOneAndUpdate({ user: winner.user }, { $inc: { points: 100, wins: 1 }}),
    await Ranking.findOneAndUpdate({ user: loser.user }, { $inc: { points: -100, losses: 1 }})
  ])
}

exports.createNotification = async (to, content, data = null) => {
  Notification.create({
    to,
    content,
    challenge: data
  })
}