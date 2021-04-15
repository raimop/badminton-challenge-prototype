const Challenge = require('../models/Challenge');
const { status } = require('../helpers/status');
const { filter } = require('../helpers/utils');

exports.getAll = async (req, res) => {
  try {
    const { user } = req;

    const doc = await Challenge.find(
      { $or: [
        { 'challenger.user': user._id },
        { 'challenged.user': user._id }]
      })
      .where("active").equals(true)
      .populate({ path:"challenger.user challenged.user winner", select:filter })

    res.status(status.success).send(doc)
  } catch (e) {
    res.status(status.bad).send({ msg: e.message });
  }
};