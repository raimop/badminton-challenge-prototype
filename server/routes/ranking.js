const router = require("express").Router();
const rankingController = require("../controllers/ranking")

router.get("/", rankingController.getAll);

module.exports = router;