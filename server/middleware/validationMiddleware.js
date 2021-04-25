const { validationResult } = require("express-validator");
const { status } = require('../helpers/status');

const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(status.unprocessable).json({ msg: errors.array() });
  next();
};

module.exports = validationMiddleware;