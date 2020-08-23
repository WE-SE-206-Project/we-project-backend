require("dotenv").config();
var bcrypt = require("bcrypt");
var sql = require("../db");
var jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

var User = require("../models/userModel");

function generateAccessToken(user) {
  return jwt.sign(
    user,
    "06cba9adaf0fe4c209cbc699016d2bc8d3876e29fc621ae58087640ba3e4271148b7a80c1ed725d4fba7d7bc056f476302af43253f037f53ff0a8eccdc1ab617"
  );
}

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("token", token);

  if (token == null) return res.sendStatus(401);

  jwt.verify(
    token,
    "06cba9adaf0fe4c209cbc699016d2bc8d3876e29fc621ae58087640ba3e4271148b7a80c1ed725d4fba7d7bc056f476302af43253f037f53ff0a8eccdc1ab617",
    (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    }
  );
};

exports.changePassword = function (req, res) {
  var saltRounds = 10;
  var email = req.body.email;
  var password = req.body.password;
  var role = req.body.role;
  var hashedPassword = bcrypt.hashSync(password, saltRounds);

  if (role === "user") {
    sql.query(
      "UPDATE user set password = ? WHERE email = ?",
      [hashedPassword, email],
      function (err, result) {
        if (err) {
          console.log("error: ", err);
          res.send(err);
        } else {
          console.log("tasks : ", result);
          res.send(result);
        }
      }
    );
  } else if (role === "org") {
    sql.query(
      "UPDATE organization set password = ? WHERE email = ?",
      [hashedPassword, email],
      function (err, result) {
        if (err) {
          console.log("error: ", err);
          res.send(err);
        } else {
          console.log("tasks : ", result);
          res.send(result);
        }
      }
    );
  }
};

exports.contactus = function (req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var message = req.body.message;

  async function sendEmail(email) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
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
      text: `
      First Name: ${firstName},
      Last Name: ${lastName},
      Email: ${email}
      Message: ${message}`,
    };

    var recepient = {
      from: "appointment.scheduler.bot@gmail.com",
      to: email,
      subject: `Reply contact us`,
      text: `${firstName} ${lastName},

Thank you for contacting us. We will contact you shorlty.`,
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
  sendEmail(email).catch(console.error);
  res.send("Email sent");
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
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var phone = req.body.phone;

  var newUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,
  };

  User.updateUser(newUser, function (err, user) {
    console.log("user updated");
    if (err) res.send(err);
    console.log("res", user);
    res.send({ user: newUser, result: user });
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
      res.send({ status: false });
    }
    console.log("res", user);
    res.send({ status: true });
  });
};

exports.login = function (req, res) {
  var email = req.body.email;
  var password = req.body.password;

  const mail = { email: email };
  const accessToken = generateAccessToken(mail);

  sql.query("SELECT * FROM user WHERE email = ?", [email], function (
    error,
    results,
    fields
  ) {
    console.log(results);
    if (error) {
      console.log("error ocurred", error);
      res.status(400).send({
        code: 400,
        failed: "error ocurred",
        results: results,
      });
    } else {
      if (results.length > 0) {
        if (
          bcrypt.compareSync(password, results[0].password) &&
          results[0].email.length >= 0
        ) {
          console.log("The solution is: ", results);
          res.status(200).send({
            code: 200,
            success: "login successful",
            results: results,
            accessToken: accessToken,
          });
        } else {
          res.status(204).send({
            code: 204,
            success: "Email and password does not match",
            results: results,
          });
        }
      } else {
        res.status(204).send({
          code: 204,
          success: "Email does not exist",
          results: results,
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
