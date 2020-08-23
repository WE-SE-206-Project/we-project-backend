var sql = require("../db");

var Appt = function (appt) {
  this.appt = appt.appt;
  this.status = appt.status;
  this.created_at = new Date();
};

Appt.getAllAppt = function (result) {
  sql.query("Select * from appointment", function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(null, err);
    } else {
      console.log("tasks : ", res);
      result(null, res);
    }
  });
};

Appt.createAppt = function (newAppt, result) {
  sql.query("INSERT INTO appointment set ?", newAppt, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("tasks : ", res);
      result(null, res);
    }
  });
};

module.exports = Appt;