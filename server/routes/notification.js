const router = require("express").Router();
const notificationRoutes = require("../controllers/notification");
const validateId = require("../middleware/validateId")
const auth = require("../middleware/auth");

router.get('/', auth, notificationRoutes.get);

router.put('/update/:id', auth, validateId, notificationRoutes.update);
router.put('/readAll/', auth, notificationRoutes.markAllAsRead);

router.delete('/delete/:id', auth, validateId, notificationRoutes.delete);
router.delete('/deleteAll', auth, notificationRoutes.deleteAll);

module.exports = router;