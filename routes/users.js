var express = require('express');
var router = express.Router();
var user = require('../controllers/userController')

/* GET users listing. */

router.get("/", user.authenticateToken, user.list_all_users);
router.post("/register", user.create_user);
router.post("/update", user.authenticateToken, user.update_user);
router.post("/login", user.login);
router.post("/contactus", user.contactus);

module.exports = router;
