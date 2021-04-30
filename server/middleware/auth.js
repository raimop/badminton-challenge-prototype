const jwt = require('jsonwebtoken');
const { status } = require( '../helpers/status');
const { MESSAGES } = require('../helpers/messages');

const auth = (req, res, next) => {
  try {
    if (!req.headers['authorization']) throw Error(MESSAGES.AUTH.ACCESS_DENIED)

    const accessToken = req.headers.authorization.split(' ')[1];

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(status.unauthorized).send({ msg: e.message });
  }
};

module.exports = auth;