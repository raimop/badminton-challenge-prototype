const Challenge = require('../models/Challenge');
const Ranking = require('../models/Ranking');
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