const router = require("express").Router();
const userController = require("../controllers/user");
const auth = require("../middleware/auth");
const { check } = require("express-validator");
const validationMiddleware = require("../middleware/validationMiddleware");

router.put('/update', auth, 
  [
    check("showHistory")
      .exists()
      .isBoolean()
      .withMessage("Peab olema kas true või false"),
    check("emailNotif")
      .exists()
      .isBoolean()
      .withMessage("Peab olema kas true või false"),
  ],
  validationMiddleware,
  userController.update
);

module.exports = router;