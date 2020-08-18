require("dotenv").config();
var bcrypt = require("bcrypt");
var validator = require("email-validator");
var sql = require("../db");
var jwt = require("jsonwebtoken");

var User = require('../models/userModel')

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

exports.list_all_users = function (req, res) {
  User.getAllUser(function (err, user) {
    console.log("users fetched");
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
    phone: phone
  };

  User.createUser(newUser, function (err, user) {
    console.log("user created");
    if (err) res.send(err);
    console.log("res", user);
    res.send(user);
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
      res.status(400).send({
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
          res.status(200).send({
            code: 200,
            success: "login sucessfull",
            accessToken: accessToken,
          });
          //next();
        } else {
          res.status(204).send({
            code: 204,
            success: "Email and password does not match",
          });
        }
      } else {
        res.status(204).send({
          code: 204,
          success: "Email does not exist",
        });
      }
    }
  });
};