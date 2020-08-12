var bcrypt = require("bcrypt");
var validator = require("email-validator");
var sql = require("../db");

var Appt = require("../models/apptModel");

exports.list_all_appt = function (req, res) {
  Appt.getAllAppt(function (err, appt) {
    console.log("Appointment fetched");
    if (err) res.send(err);
    console.log("res", appt);
    res.send(appt);
  });
};

exports.create_appt = function (req, res) {
  var saltRounds = 10;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var address = req.body.address;
  var phone_no = req.body.phone_no;
  var password = req.body.password;
  var schedule_at = req.body.schedule_at;
  var hashedPassword = bcrypt.hashSync(password, saltRounds);

  var newAppt = {
    firstname: firstname,
    lastname:lastname,
    email: email,
    address:address,
    phone_no: phone_no,
    password: hashedPassword,
    schedule_at:schedule_at
  };

  Appt.createAppt(newAppt, function (err, appt) {
    console.log("Appointment created");
    if (err) res.send(err);
    console.log("res", appt);
    res.send(appt);
  });
};

// exports.login = function (req, res) {
//   //   var username = req.body.username;
//   var email = req.body.email;
//   var password = req.body.password;

//   //   const user = { name: username };

//   sql.query("SELECT * FROM email WHERE email = ?", [email], function (
//     error,
//     results,
//     fields
//   ) {
//     if (error) {
//       console.log("error ocurred", error);
//       res.status(400).send({
//         code: 400,
//         failed: "error ocurred",
//       });
//     } else {
//       if (results.length > 0) {
//         if (
//           bcrypt.compareSync(password, results[0].password) &&
//           results[0].username.length >= 0
//         ) {
//           console.log("The solution is: ", results);
//           res.status(200).send({
//             code: 200,
//             success: "login successful",
//           });
//           //next();
//         } else {
//           res.status(204).send({
//             code: 204,
//             success: "Email and password does not match",
//           });
//         }
//       } else {
//         res.status(204).send({
//           code: 204,
//           success: "Email does not exist",
//         });
//       }
//     }
//   });
// };
