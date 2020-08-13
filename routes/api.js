var express = require("express");
var router = express.Router();
var appt = require("../controllers/apptController");

// router.get("/", function (req, res, next) {
//   res.send("respond with a resource");
// });

router.get("/", appt.list_all_appt);
router.post("/create", appt.create_appt);
//router.post("/login", appt.login);

module.exports = router;