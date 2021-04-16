const router = require("express").Router();
const auth = require("../middleware/auth");
const validateId = require("../middleware/validateId")
const rankingController = require("../controllers/ranking")

router.get("/", rankingController.getAll);
router.get("/:id", validateId, rankingController.getOne);

router.post("/join", auth, rankingController.join);
router.post("/leave", auth, rankingController.leave);

module.exports = router;