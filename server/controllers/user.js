const User = require('../models/User');
const { status } = require('../helpers/status');
const { MESSAGES } = require('../helpers/messages');
const { filter } = require('../helpers/utils');

exports.update = async (req, res) => {
  try {
    const { user } = req;

    const userFound = await User.findOne({ _id: user._id }).select(filter)
    userFound.preferences.showHistory = !userFound.preferences.showHistory
    if (!userFound) throw Error(MESSAGES.USER.DOES_NOT_EXIST);

    userFound.save()

    res.status(status.success).send(userFound);
  } catch (e) {
    res.status(status.bad).json({ msg: e.message });
  }
}