var sql = require("../db");
exports.validatetime = function (schedule_at) {
  //var username = req.body.username;
  var schedule_time = schedule_at;
  console.log("schedule at",schedule_time)

  // const user = { email: schedule_time };

  sql.query(
    "SELECT * FROM appointment WHERE schedule_at = ?",
    [schedule_time],
    function (error, results, fields) {
      console.log("results", results);
      // if (error) {
      //   console.log("error occured");
      //   return 0;
      // }
      if (results !== []) {
        console.log('results',results);
        console.log("time slot taken");
        return 0;
      } else if (results === []) {
        console.log("results", results);
        console.log("time slot available");
        return 1;
      }
    }
  );
};
