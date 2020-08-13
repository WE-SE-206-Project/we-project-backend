var sql = require("../db");

var Org = function (org) {
  this.org = org.org;
  this.status = org.status;
  this.created_at = new Date();
};

Org.getAllOrg = function (result) {
  sql.query("Select * from organization", function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(null, err);
    } else {
      console.log("tasks : ", res);
      result(null, res);
    }
  });
};

Org.createOrg = function (newOrg, result) {
  sql.query("INSERT INTO organization set ?", newOrg, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("tasks : ", res);

      result(null, res);
    }
  });
};

module.exports = Org;