const Challenge = require('../models/Challenge');
const Ranking = require('../models/Ranking');
const User = require('../models/User');
const { status } = require('../helpers/status');
const { filter } = require('../helpers/utils');
const { MESSAGES } = require('../helpers/messages');
const moment = require("moment-timezone");
moment.updateLocale('et', { months : [ "jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember" ]});

exports.create = async (req, res) => {
  try {
    const { address, datetime } = req.body;
    if (!address || !datetime) throw Error(MESSAGES.CHALLENGE.MUST_ENTER_PLACE_TIME)

    if (moment(datetime).diff(moment(), "minutes") <= 2880) throw Error(MESSAGES.CHALLENGE.DATETIME_LESS_THAN_48H)
    
    const { user } = req;
    const { id } = req.params;
    if (user._id === id) throw Error(MESSAGES.CHALLENGE.CANNOT_CHALLENGE_SELF)
    
    const doc = await Ranking.find({ "user": [user._id, id] }).populate({ path: 'user', select: filter })
  
    if (!doc || doc.length !== 2){
      throw Error(MESSAGES.CHALLENGE.BOTH_MUST_BE_JOINED)
    }
  
    const challenge = new Challenge({
      challenger: { user: user._id },
      challenged: { user: id },
      info: {
        category: user.gender === "m" ? "ms" : "ws",
        datetime,
        address
      },
    })

    const data = await challenge.save();

    res.status(status.created).send(data);
  } catch (e) {
    res.status(status.conflict).json({ msg: e.message })
  };
}

exports.accept = async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;

    const challenge = await Challenge.findOne({ _id: id })
    if (!challenge) throw Error(MESSAGES.CHALLENGE.NOT_FOUND)
    if (challenge.active) throw Error(MESSAGES.CHALLENGE.ALREADY_ACCEPTED)

    if (challenge.challenged.user.toString() !== user._id && challenge.challenger.user.toString() !== user._id){
      throw Error(MESSAGES.CHALLENGE.MUST_BE_PARTICIPANT)
    }

    if (challenge.challenged.user.toString() !== user._id){
      throw Error(MESSAGES.CHALLENGE.CANNOT_ACCEPT)
    }

    challenge.active = true

    await challenge.save();
    res.status(status.success).send(challenge)
  } catch(e) {
    res.status(status.bad).json({ msg: e.message });
  }
}

exports.deleteChallenge = async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;
    
    const challenge = await Challenge.findOne({ _id: id })
    if (!challenge) throw Error(MESSAGES.CHALLENGE.NOT_FOUND)

    if (challenge.challenged.user.toString() !== user._id && challenge.challenger.user.toString() !== user._id){
      throw Error(MESSAGES.CHALLENGE.CANNOT_DELETE_CHALLENGE_SELF)
    }

    if (challenge.active && !(moment(challenge.info.datetime).diff(moment(), "minutes") >= 1440)) throw Error(MESSAGES.CHALLENGE.CANNOT_DELETE_24H)
    if (challenge.challenger.resultAccepted || challenge.challenged.resultAccepted) throw Error(MESSAGES.CHALLENGE.CANNOT_DELETE_RESULT)

    const deletedChallenge = await challenge.delete();
    if (!deletedChallenge) throw Error(MESSAGES.CHALLENGE.ERROR_DELETING)

    res.status(status.success).send(challenge)
  } catch (e) {
    res.status(status.bad).json({ msg: e.message });
  }
};

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

exports.history = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id }).select(filter);
    if (!user) throw Error(MESSAGES.USER.DOES_NOT_EXIST)

    let doc = []
    
    if (user.preferences.showHistory){
      doc = await Challenge.find(
        { $and: [
          { $or: [{ 'challenger.user': id }, { 'challenged.user': id }] },
          { $and: [{ 'challenger.resultAccepted': true }, { 'challenged.resultAccepted': true }]}
          ]
        })
        .where("active").equals(true)
        .populate({ path:"challenger.user challenged.user winner", select:filter })
    }

    res.status(status.success).send({ user, data: doc });
  } catch (e) {
    res.status(status.bad).send({ msg: e.message });
  }
}