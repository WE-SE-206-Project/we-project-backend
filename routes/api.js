var express = require("express");
var router = express.Router();
var appt = require("../controllers/apptController");
var user = require("../controllers/userController")

// router.get("/", function (req, res, next) {
//   res.send("respond with a resource");
// });

router.post("/getAppointment", user.authenticateToken,appt.getAppointment)
router.post("/changePassword", user.changePassword);
router.get("/", user.authenticateToken,appt.list_all_appt);
router.post("/create", user.authenticateToken, appt.create_appt);
//router.post("/login", appt.login);

module.exports = router;