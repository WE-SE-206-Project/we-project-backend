var bcrypt = require("bcrypt");
var validator = require("email-validator");
var sql = require("../db");

var User = require('../models/userModel')

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
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var hashedPassword = bcrypt.hashSync(password, saltRounds);

  var newUser = {
    username: username,
    email: email,
    password: hashedPassword,
  };

  User.createUser(newUser, function (err, user) {
    console.log("user created");
    if (err) res.send(err);
    console.log("res", user);
    res.send(user);
  });
};

exports.login = function (req, res) {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;

  const user = { name: username };

  sql.query("SELECT * FROM user WHERE username = ?", [username], function (
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
          results[0].username.length >= 0
        ) {
          console.log("The solution is: ", results);
          res.status(200).send({
            code: 200,
            success: "login sucessfull",
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