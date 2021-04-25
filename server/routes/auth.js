const router = require("express").Router();
const authController = require("../controllers/auth");
const { check } = require("express-validator");
const validationMiddleware = require("../middleware/validationMiddleware");

router.get(
  "/confirm/:confirmationCode",
  check("confirmationCode").exists().trim().escape(),
  validationMiddleware,
  authController.verifyUser
);

router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Peab olema korrektne e-mail"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Peab olema vähemalt 6 tähemärki"),
  ],
  validationMiddleware,
  authController.login
);

router.post(
  "/signup",
  [
    check("firstName")
      .isLength({ min: 3 })
      .withMessage("Peab olema vähemalt 2 tähemärki")
      .trim()
      .exists()
      .matches(/^[A-ZÕÄÖÜ][a-zõäöü]+$/).withMessage('Nimi peab olema tähestikuline'),
    check("lastName")
      .isLength({ min: 3 })
      .withMessage("Peab olema vähemalt 2 tähemärki")
      .trim()
      .exists()
      .matches(/^[A-ZÕÄÖÜ][a-zõäöü]+$/).withMessage('Nimi peab olema tähestikuline'),
    check("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Peab olema korrektne e-mail"),
    check("gender").exists().isIn(["m", "f"]).withMessage("Peab olema m või f"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Peab olema vähemalt 6 tähemärki"),
  ],
  validationMiddleware,
  authController.signup
);

module.exports = router;
