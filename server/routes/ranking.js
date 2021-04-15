const router = require("express").Router();
const auth = require("../middleware/auth");
const rankingController = require("../controllers/ranking")

router.get("/", rankingController.getAll);

router.post("/join", auth, rankingController.join);
router.post("/leave", auth, rankingController.leave);

module.exports = router;