const Ranking = require('../models/Ranking');
const { filter } = require('../helpers/utils');
const { status } = require('../helpers/status');
const { MESSAGES } = require('../helpers/messages');

exports.getAll = async (req, res) => {
  try {
    const ms = await Ranking.find({ category: "ms" }).sort({ points: -1 }).populate({ path: 'user', select: filter })
    const ws = await Ranking.find({ category: "ws" }).sort({ points: -1 }).populate({ path: 'user', select: filter })

    res.status(status.success).json({ ms, ws });
  } catch (e) {
    res.status(status.bad).json({ msg: e.message });
  }
}

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await Ranking.find({ _id: id }).populate({ path: 'user', select: filter })
    if (!doc || !doc.length) throw Error(MESSAGES.RANKING.DOES_NOT_EXIST);

    res.status(status.success).json(doc);
  } catch (e) {
    res.status(status.bad).json({ msg: e.message });
  }
}

exports.leave = async (req, res) => {
  try {
    const { user } = req
    const doc = await Ranking.findOneAndDelete({ user: user._id }).populate({ path: 'user', select: filter })
    if (!doc) throw Error(MESSAGES.RANKING.CANNOT_LEAVE)

    res.status(status.success).json({ msg: MESSAGES.RANKING.SUCCESS_LEAVE });
  } catch (e) {
    res.status(status.bad).json({ msg: e.message });
  }
};

exports.join = async (req, res) => {
  try {
    const { user } = req
    if (!user) throw Error(MESSAGES.USER.NO_INFO)

    const doc = await Ranking.findOne({ user: user._id }).populate({ path: 'user', select: filter })
    if (doc) throw Error(MESSAGES.RANKING.CANNOT_JOIN)

    const data = {
      user: user._id,
      category: user.gender === "m" ? "ms" : "ws",
    }

    const newRanking = new Ranking(data);
    const savedRanking = await newRanking.save()
    if (!savedRanking) throw Error(MESSAGES.RANKING.ERROR_SAVING);    

    res.status(status.success).json({ msg: MESSAGES.RANKING.SUCCESS_JOIN })
  } catch (e) {
    res.status(status.bad).json({ msg: e.message });
  }
}