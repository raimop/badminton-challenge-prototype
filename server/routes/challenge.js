const router = require("express").Router();
const auth = require("../middleware/auth");
const validateId = require("../middleware/validateId")
const challengeController = require("../controllers/challenge");

router.get("/", auth, challengeController.getAll);
router.get("/history/:id", auth, validateId, challengeController.history);

router.post("/create/:id", auth, validateId, challengeController.create);

module.exports = router;