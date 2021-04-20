const Challenge = require('../models/Challenge');
const Ranking = require('../models/Ranking');
const User = require('../models/User');
const { status } = require('../helpers/status');
const { filter, createNotification, updatePoints } = require('../helpers/utils');
const { MESSAGES } = require('../helpers/messages');
const moment = require("moment-timezone");
moment.updateLocale('et', { months : [ "jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember" ]});

const shortTimeFormat = 'DD.MM HH.mm'

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

    createNotification(id, `Sinule on ${user.firstName} ${user.lastName} esitanud väljakutse ${moment(challenge.info.datetime).format(shortTimeFormat)}`, challenge)

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

    let content = `${user.firstName} ${user.lastName} aktsepteeris teievahelise väljakutse, mis toimub ${moment(challenge.info.datetime).format(shortTimeFormat)}.`
    createNotification(challenge.challenger.user, content)

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

    let sendTo, content;
    if (!challenge.active){
      sendTo = challenge.challenger.user
      content = `${user.firstName} ${user.lastName} loobus Sinu esitatud väljakutsest.`
    } else {
      sendTo = challenge.challenged.user.toString() === user._id ? challenge.challenger.user : challenge.challenged.user
      content = `${user.firstName} ${user.lastName} kustutas teievahelise väljakutse, mis oli kuupäeval ${moment(challenge.info.datetime).format(shortTimeFormat)}.`
    }
    
    createNotification(sendTo, content)

    const deletedChallenge = await challenge.delete();
    if (!deletedChallenge) throw Error(MESSAGES.CHALLENGE.ERROR_DELETING)

    res.status(status.success).send(challenge)
  } catch (e) {
    res.status(status.bad).json({ msg: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { user } = req;
    const { score, winner } = req.body;
    const { id } = req.params;
    
    const challenge = await Challenge.findOne({ _id: id })
      .populate({ path:"challenger.user challenged.user", select:filter })
    if (!challenge) throw Error(MESSAGES.CHALLENGE.DOES_NOT_EXIST)

    if (challenge.challenged.user._id.toString() !== user._id && challenge.challenger.user._id.toString() !== user._id){
      throw Error(MESSAGES.CHALLENGE.CANNOT_UPDATE_CHALLENGE_SELF)
    }

    /* if(moment(challenge.info.datetime).diff(moment()) >= 0){
      throw Error(MESSAGES.CHALLENGE.CANNOT_UPDATE_FUTURE_CHALLENGE)
    } */

    if (challenge.winner == null){
      challenge.winner = winner;
      challenge.result = score;
    } else {
      if (winner != challenge.winner || !score.every((outerElem, outerIndex) => outerElem.every((innerElem, innerIndex) => innerElem === challenge.result[outerIndex][innerIndex]))){
        if (challenge.challenger.user._id.toString() === user._id) {
          challenge.challenged.resultAccepted = false
        } else {
          challenge.challenger.resultAccepted = false
        } 
        
        challenge.result = score;
        challenge.winner = winner;
      }
    }

    if (challenge.challenger.user._id.toString() === user._id) {
      challenge.challenger.resultAccepted = true
    } else {
      challenge.challenged.resultAccepted = true;
    }

    if (challenge.challenger.resultAccepted && challenge.challenged.resultAccepted){
      if (challenge.winner.toString() === challenge.challenger.user._id.toString()){
        finalResult = { winner: challenge.challenger, loser: challenge.challenged }
      } else {
        finalResult = { winner: challenge.challenged, loser: challenge.challenger }
      }
      updatePoints(finalResult)
    }

    const doc = await challenge.save()

    res.status(status.success).send(doc)
  } catch (e) {
    res.status(status.bad).send({ msg: e.message });
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
      //.where("active").equals(true)
      .populate({ path:"challenger.user challenged.user winner", select:filter })

    res.status(status.success).send(doc)
  } catch (e) {
    res.status(status.bad).send({ msg: e.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await Challenge.findOne({ _id: id })
      .populate({ path: "challenger.user challenged.user winner", select:filter })

    if (!doc) throw Error(MESSAGES.CHALLENGE.DOES_NOT_EXIST)

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