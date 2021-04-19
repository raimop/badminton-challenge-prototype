const { status } = require( '../helpers/status');
const { MESSAGES } = require('../helpers/messages');

const validateScore = (req, res, next) => {
  try {
    const validate = (s1, s2) => {
      if ((s1 === 30 || s2 === 30) && ((Math.abs(s1-s2) === 1) || (Math.abs(s1-s2) === 2))) return true // 30-28, 30-29 exception
      if ((s1 > 21 || s2 > 21) && (Math.abs(s1-s2) === 2)) return true // if both over 21 exception
      if ((s1 === 21 && s2 <= 19) || (s2 === 21 && s1 <= 19)) return true // normal score
      return false
    }
    
    const { score } = req.body;
    
    if (!Array.isArray(score) || score.length < 2 || score.length > 3) throw Error(MESSAGES.CHALLENGE.INVALID_SCORE)
    let validateTwoGames = validate(score[0][0], score[0][1]) && validate(score[1][0], score[1][1])
    
    if (score.length === 2){
      if ((!score.every(e => e[0] > e[1])) || !validateTwoGames) throw Error(MESSAGES.CHALLENGE.INVALID_SCORE)
    } else if (score.length === 3){
      if ((!(score[0][0] > score[0][1] && score[1][0] < score[1][1] && score[2][0] > score[2][1]) && !(score[0][0] < score[0][1] && score[1][0] > score[1][1] && score[2][0] > score[2][1])) || !(validateTwoGames && validate(score[2][0], score[2][1]))) throw Error(MESSAGES.CHALLENGE.INVALID_SCORE)
    }

    next();
  } catch (e) {
    return res.status(status.bad).send({ msg: e.message });
  }
};

module.exports = validateScore;