var express = require('express');
var router = express.Router();
var user = require('../controllers/userController')

/* GET users listing. */


router.get("/", user.list_all_users);
router.post("/register", user.create_user);
router.post("/login", user.login);

module.exports = router;
