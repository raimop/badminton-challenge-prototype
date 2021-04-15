const router = require("express").Router();
const auth = require("../middleware/auth");
const challengeController = require("../controllers/challenge");

router.get("/", auth, challengeController.getAll);

module.exports = router;