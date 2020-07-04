var sql = require("../db");

var User = function (user) {
  this.user = user.user;
  this.status = user.status;
  this.created_at = new Date();
};

User.getAllUser = function (result) {
  sql.query("Select * from user", function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(null, err);
    } else {
      console.log("tasks : ", res);

      result(null, res);
    }
  });
};

User.createUser = function (newUser, result) {
  sql.query("INSERT INTO user set ?", newUser, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("tasks : ", res);

      result(null, res);
    }
  });
};

module.exports = User;