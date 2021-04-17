const router = require("express").Router();
const userController = require("../controllers/user");
const auth = require("../middleware/auth");

router.put('/update', auth, userController.update);

module.exports = router;