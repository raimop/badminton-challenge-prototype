const Notification = require('../models/Notification');
const { status } = require('../helpers/status');
const { filter } = require('../helpers/utils');
const { MESSAGES } = require('../helpers/messages');

exports.get = async (req, res) => {
  try {
    const { user } = req;
    const notifications = await Notification.find({ to: user._id }).populate({ path: 'to', select: filter }).populate({ path: 'challenge' })
    if (!notifications) throw Error(MESSAGES.NOTIFICATION.DOES_NOT_EXIST);

    res.status(status.success).json(notifications);
  } catch (e) {
    res.status(status.bad).json({ msg: e.message });
  }
}

exports.update = async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;

    const notifications = await Notification.findOneAndUpdate(
      {  $and: [
              { _id: id },
              { to: user._id }
            ]
      }, { $bit: { read: { xor: 1 } } })

    if (!notifications) throw Error(MESSAGES.NOTIFICATION.DOES_NOT_EXIST);

    res.status(status.success).json(notifications);
  } catch (e) {
    res.status(status.bad).json({ msg: e.message });
  }
}
exports.delete = async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;
    const deletedNotification = await Notification.findOneAndDelete(
      {  $and: [
              { _id: id },
              { to: user._id }
            ]
      })

    if (!deletedNotification) throw Error(MESSAGES.NOTIFICATION.DOES_NOT_EXIST);
    
    res.status(status.success).json(deletedNotification);
  } catch (e) {
    res.status(status.bad).json({ msg: e.message });
  }
}

exports.deleteAll = async (req, res) => {
  try {
    const { user } = req;
    const deletedNotification = await Notification.deleteMany({ to: user._id })

    if (!deletedNotification) throw Error(MESSAGES.NOTIFICATION.DOES_NOT_EXIST);
    res.status(status.success).json(deletedNotification);
  } catch (e) {
    res.status(status.bad).json({ msg: e.message });
  }
}

exports.markAllAsRead = async (req, res) => {
  try {
    const { user } = req;
    const markedAsRead = await Notification.updateMany({ to: user._id }, { read: 1 })
    if (!markedAsRead.n) throw Error(MESSAGES.NOTIFICATION.DO_NOT_EXIST);

    res.status(status.success).json({ msg: `${markedAsRead.nModified} teadet märgitud loetuks` });
  } catch (e) {
    res.status(status.bad).json({ msg: e.message });
  }
}