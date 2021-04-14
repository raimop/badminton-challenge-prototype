const Ranking = require('../models/Ranking');
const { filter } = require('../helpers/utils');
const { status } = require('../helpers/status');

exports.getAll = async (req, res) => {
  try {
    const ms = await Ranking.find({ category: "ms" }).sort({ points: -1 }).populate({ path: 'user', select: filter })
    const ws = await Ranking.find({ category: "ws" }).sort({ points: -1 }).populate({ path: 'user', select: filter })

    res.status(status.success).json({ ms, ws });
  } catch (e) {
    res.status(status.bad).json({ msg: e.message });
  }
}