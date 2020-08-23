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

exports.getAppointment = function (req, res) {
  var email = req.body.email;
  var role = req.body.role
  var orgId = req.body.orgId

  if (role === "user") {
    sql.query("SELECT * FROM appointment WHERE email = ?", [email], function (
      error,
      results,
      fields
    ) {
      if (error) {
        res.send(error);
      } else {
        console.log("results", results);
        res.send(results);
      }
    });
  } else if (role === "org") {
    sql.query("SELECT * FROM appointment WHERE orgId = ?", [orgId], function (
      error,
      results,
      fields
    ) {
      if (error) {
        res.send(error);
      } else {
        console.log("results", results);
        res.send(results);
      }
    });
  }
  
};

exports.create_appt = async function (req, res) {
  //var saltRounds = 10;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  let email = req.body.email;
  var address = req.body.address;
  var phone = req.body.phone;
  var reason = req.body.reason;
  var orgId = req.body.orgId;
  var schedule_at = req.body.schedule_at;
  console.log("schedule at", schedule_at);
  let check;
  let apptRes;

  async function sendEmail(email) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      // port: 587,
      // secure: false, // true for 465, false for other ports
      auth: {
        user: "appointment.scheduler.bot@gmail.com", // generated ethereal user
        pass: "hfdgbkrmdrlcarfl", // generated ethereal password
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
      from: "appointment.scheduler.bot@gmail.com",
      to: "appointment.scheduler.bot@gmail.com",
      subject: `Reply contact us`,
      text: `Dear Mr. ${firstName} ${lastName},

Thank you for contacting us.

Regards,

Hamza Shahab,`,
    };

    var recepient = {
      from: "appointment.scheduler.bot@gmail.com",
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

  await sql.query(
    "SELECT * FROM appointment WHERE schedule_at = ?",
    [schedule_at],
    function (error, results, fields) {
      console.log("results", results);
      // if (error) {
      //   console.log("error occured");
      //   return 0;
      // }
      if (results.length > 0) {
        //console.log("results", results);
        console.log("time slot taken");
        check = 0;
      } else if (results.length === 0) {
        //console.log("results", results);
        console.log("time slot available");
        check = 1;
      }
      console.log("check", check);
      if (check === 0) res.status(200).json("Sorry, time slot not available!");
      else {
        var newAppt = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          orgId: orgId,
          address: address,
          phone: phone,
          reason: reason,
          schedule_at: schedule_at,
        };

       

        Appt.createAppt(newAppt, function (err, appt) {    
          sql.query(
            "Select * from appointment where schedule_at=?",
            [schedule_at],
            function (err, result) {
              if (err) {
                console.log("error: ", err);
                res.send(err);
              } else {
                console.log("appointment : ", res);
                sendEmail(email).catch(console.error);
                //apptRes = res;
                res.send(result)
              }
            }
          );
          // console.log("Appointment created");
          // if (err) res.send(err);
          // console.log("res", newAppt);
          
          // res.send({ appt: apptRes, status: "Email sent" });
        });
      }
    }
  );

  //var hashedPassword = bcrypt.hashSync(password, saltRounds);
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
