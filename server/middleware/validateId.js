const mongoose = require('mongoose');
const { status } = require( '../helpers/status');

const validateId = (req, res, next) => {
  try {
    if (!req.params.id) throw Error("ID puudub")
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) throw Error("ID ei ole korrektne");
    next();
  } catch (e) {
    return res.status(status.unprocessable).send({ msg: e.message });
  }
};

module.exports = validateId;