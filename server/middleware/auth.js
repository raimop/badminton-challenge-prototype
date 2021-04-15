const jwt = require('jsonwebtoken');
const { status } = require( '../helpers/status');

const auth = (req, res, next) => {
  if (!req.headers['authorization']) throw Error("Juurdepääsuluba puudub")

  const accessToken = req.headers.authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(status.unauthorized).send({ msg: "Juurdepääsuloa kinnitamine ebaõnnestus" });
  }
};

module.exports = auth;