const router = require("express").Router();
const auth = require("../middleware/auth");
const validateScore = require("../middleware/validateScore");
const validateId = require("../middleware/validateId")
const { check } = require("express-validator");
const validationMiddleware = require("../middleware/validationMiddleware");
const challengeController = require("../controllers/challenge");

router.get("/", auth, challengeController.getAll);
router.get("/:id", auth, validateId, challengeController.getOne);
router.get("/history/:id", auth, validateId, challengeController.history);

router.post("/create/:id", auth, 
  [ 
    check("address")
      .isLength({ min: 2 })
      .trim()
      .escape()
      .exists()
      .matches(/^[A-Za-zõäöüÕÄÖÜ\s]+$/).withMessage('Aadress peab olema tähestikuline'),
    check("datetime")
      .isLength({ min: 10 })
      .trim()
      .escape()
      .exists()
      .toDate().withMessage('Kuupäev peab olema kuupäeva formaadis'),
  ],
  validationMiddleware,
  validateId, challengeController.create
);

router.put("/update/:id", auth, validateScore, validateId, challengeController.update);
router.put("/accept/:id", auth, validateId, challengeController.accept);

router.delete("/delete/:id", auth, validateId, challengeController.deleteChallenge);

module.exports = router;