const router = require("express").Router();
const auth = require("../middleware/auth");
const validateId = require("../middleware/validateId")
const challengeController = require("../controllers/challenge");

router.get("/", auth, challengeController.getAll);
router.get("/history/:id", auth, validateId, challengeController.history);

router.post("/create/:id", auth, validateId, challengeController.create);

router.put("/accept/:id", auth, validateId, challengeController.accept);

router.delete("/delete/:id", auth, validateId, challengeController.deleteChallenge);

module.exports = router;