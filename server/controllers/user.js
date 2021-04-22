const User = require('../models/User');
const { status } = require('../helpers/status');
const { MESSAGES } = require('../helpers/messages');
const { filter } = require('../helpers/utils');

exports.update = async (req, res) => {
  try {
    const { user } = req;
    const { showHistory, emailNotif } = req.body;

    const userFound = await User.findOne({ _id: user._id }).select(filter)
    if (!userFound) throw Error(MESSAGES.USER.DOES_NOT_EXIST);
    
    userFound.preferences.showHistory = showHistory
    userFound.preferences.emailNotif = emailNotif
    

    const savedUser = await userFound.save()

    res.status(status.success).send(savedUser);
  } catch (e) {
    res.status(status.bad).json({ msg: e.message });
  }
}