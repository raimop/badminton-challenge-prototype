const router = require("express").Router();
const authController = require("../controllers/auth");
const { check, validationResult } = require("express-validator");
const { MESSAGES } = require('../helpers/messages');
const { status } = require('../helpers/status');

const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(status.unprocessable).json({ msg: MESSAGES.USER.INVALID_FIELD_VALUES });
  next();
};

router.get("/confirm/:confirmationCode", authController.verifyUser)

router.post('/login', 
  [
    check("email").isEmail().normalizeEmail().withMessage("Peab olema korrektne e-mail"),
    check("password").isLength({ min: 6 }).withMessage("Peab olema vähemalt 6 tähemärki")  
  ],
  validationMiddleware,
  authController.login);

router.post('/signup',
  [
    check("firstName").isLength({ min: 2 }).withMessage("Peab olema vähemalt 2 tähemärki").exists(),
    check("lastName").isLength({ min: 2 }).withMessage("Peab olema vähemalt 2 tähemärki").exists(),
    check("email").isEmail().normalizeEmail().withMessage("Peab olema korrektne e-mail"),
    check("gender").exists().isIn(['m', 'f']).withMessage("Peab olema m või f"),
    check("password").isLength({ min: 6 }).withMessage("Peab olema vähemalt 6 tähemärki")
  ],
  validationMiddleware, 
  authController.signup
  );

module.exports = router;