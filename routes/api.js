var express = require("express");
var router = express.Router();
var appt = require("../controllers/apptController");
var user = require("../controllers/userController")

router.post("/getAppointment", user.authenticateToken,appt.getAppointment)
router.post("/changePassword", user.authenticateToken,user.changePassword);
router.get("/", user.authenticateToken,appt.list_all_appt);
router.post("/create", user.authenticateToken, appt.create_appt);
router.get("/auth",user.authenticateToken)

module.exports = router;