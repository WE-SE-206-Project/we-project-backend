var express = require("express");
var router = express.Router();
var org = require("../controllers/orgController");

router.get("/", org.authenticateToken,org.list_all_orgs);
router.post("/register", org.create_org);
router.post("/login", org.login);
router.post("/update", org.authenticateToken, org.update_org);

module.exports = router;