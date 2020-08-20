require("dotenv").config();
var bcrypt = require("bcrypt");
var validator = require("email-validator");
var sql = require("../db");
var jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

var User = require("../models/userModel");

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1800s",
  });
}

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

exports.contactus = function (req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var message = req.body.message;

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

    var mailOptions = {
      from: "hamzashahab1610@gmail.com",
      to: email,
      subject: `Reply contact us`,
      text: `Dear Mr. ${firstName} ${lastName},

Thank you for contacting us.

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
  sendEmail("hamzashahab1610@gmail.com").catch(console.error);
  sendEmail(email).catch(console.error);
};

exports.list_all_users = function (req, res) {
  User.getAllUser(function (err, user) {
    console.log("users fetched");
    if (err) res.send(err);
    console.log("res", user);
    res.send(user);
  });
};

exports.update_user = function (req, res) {
  var saltRounds = 10;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var password = req.body.password;
  var phone = req.body.phone;
  var hashedPassword = bcrypt.hashSync(password, saltRounds);

  var newUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashedPassword,
    phone: phone,
  };

  User.updateUser(newUser, function (err, user) {
    console.log("user updated");
    if (err) res.send(err);
    console.log("res", user);
    res.send(user);
  });
};

exports.create_user = function (req, res) {
  var saltRounds = 10;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var password = req.body.password;
  var phone = req.body.phone;
  var hashedPassword = bcrypt.hashSync(password, saltRounds);

  var newUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashedPassword,
    phone: phone,
  };

  User.createUser(newUser, function (err, user) {
    console.log("user created");
    if (err) {
      res.json({status: false})
      //res.send(err);
    }
    console.log("res", user);
     res.json({ status: true });
    //res.send(user);
  });
};

exports.login = function (req, res) {
  //var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;

  const user = { email: email };

  sql.query("SELECT * FROM user WHERE email = ?", [email], function (
    error,
    results,
    fields
  ) {
    if (error) {
      console.log("error ocurred", error);
      res.send({
        code: 400,
        failed: "error ocurred",
      });
    } else {
      if (results.length > 0) {
        if (
          bcrypt.compareSync(password, results[0].password) &&
          results[0].email.length >= 0
        ) {
          const accessToken = generateAccessToken(user);
          console.log("The solution is: ", results);
          res.send({
            code: 200,
            success: "login sucessfull",
            result: results,
            accessToken: accessToken,
          });
          //next();
        } else {
          res.send({
            code: 204,
            success: "Email and password does not match",
          });
        }
      } else {
        res.send({
          code: 204,
          success: "Email does not exist",
        });
      }
    }
  });
};

exports.index = function (req, res) {
  res.json({
    success: true,
    message: "Index page",
  });
};
