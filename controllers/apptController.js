var bcrypt = require("bcrypt");
var validator = require("email-validator");
var sql = require("../db");
const nodemailer = require("nodemailer");

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

  async function sendEmail() {
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

    var mailOptions = {
      from: "hamzashahab1610@gmail.com",
      to: email,
      subject: `Confirmation of Appointment`,
      text: `Dear Mr. ${firstName} ${lastName},

I would like to confirm your appointment scheduled on ${schedule_at} at 2 pm. For further questions and queries contact us at:

03xx-xxxxxxx

Regards,

Hamza Shahab,`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
  sendEmail().catch(console.error);

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
