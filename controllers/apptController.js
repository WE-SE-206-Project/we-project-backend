var bcrypt = require("bcrypt");
var validator = require("email-validator");
var sql = require("../db");
const nodemailer = require("nodemailer");
var express = require("express");
var Appt = require("../models/apptModel");
var router = express.Router();
var validatetime = require("./prac");
const { json } = require("body-parser");
exports.list_all_appt = function (req, res) {
  Appt.getAllAppt(function (err, appt) {
    console.log("Appointment fetched");
    if (err) res.send(err);
    console.log("res", appt);
    res.send(appt);
  });
};

exports.create_appt = function (req, res) {
  //var saltRounds = 10;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  let email = req.body.email;
  var address = req.body.address;
  var phone = req.body.phone;
  var reason = req.body.reason;
  //var password = req.body.password;
  var schedule_at = req.body.schedule_at;

  //var hashedPassword = bcrypt.hashSync(password, saltRounds);
  let check = validatetime.validatetime(schedule_at);
  console.log("check", check);
  if (check === 0)
    return res.status(400).json("Sorry, tiem slot not available!");

  async function sendEmail(email) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      // port: 587,
      // secure: false, // true for 465, false for other ports
      auth: {
        user: "hamzashahab1610@gmail.com", // generated ethereal user
        pass: "wnvzosddxkknwraw", // generated ethereal password
      },
    });

    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });

    var sender = {
      from: "hamzashahab1610@gmail.com",
      to: "hamzashahab1610@gmail.com",
      subject: `Reply contact us`,
      text: `Dear Mr. ${firstName} ${lastName},

Thank you for contacting us.

Regards,

Hamza Shahab,`,
    };

    var recepient = {
      from: "hamzashahab1610@gmail.com",
      to: email,
      subject: `Reply contact us`,
      text: `Dear Mr. ${firstName} ${lastName},

Thank you for contacting us.

Regards,

Hamza Shahab,`,
    };

    transporter.sendMail(sender, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent to sender: " + info.response);
      }
    });
    transporter.sendMail(recepient, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent to recepient: " + info.response);
      }
    });
  }

  var newAppt = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    address: address,
    phone: phone,
    reason: reason,
    schedule_at: schedule_at,
  };

  Appt.createAppt(newAppt, function (err, appt) {
    console.log("Appointment created");
    if (err) res.send(err);
    console.log("res", appt);
    sendEmail(email).catch(console.error);
    res.send({ appt: appt, status: "Email sent" });
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
