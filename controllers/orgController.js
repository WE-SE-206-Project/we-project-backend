var bcrypt = require("bcrypt");
var validator = require("email-validator");
var sql = require("../db");

var Org = require("../models/orgModel");

exports.list_all_orgs = function (req, res) {
  Org.getAllOrg(function (err, org) {
    console.log("Organization fetched");
    if (err) res.send(err);
    console.log("res", org);
    res.send(org);
  });
};

exports.create_org = function (req, res) {
  var saltRounds = 10;
  var username = req.body.username;
  var email = req.body.email;
  var phone_no = req.body.phone_no;
  var password = req.body.password;
  var hashedPassword = bcrypt.hashSync(password, saltRounds);

  var newOrg = {
    username: username,
    email: email,
    phone_no: phone_no,
    password: hashedPassword,
  };

  Org.createOrg(newOrg, function (err, org) {
    console.log("Organization created");
    if (err) res.send(err);
    console.log("res", org);
    res.send(org);
  });
};

exports.login = function (req, res) {
  //   var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;

  //   const user = { name: username };

  sql.query("SELECT * FROM email WHERE email = ?", [email], function (
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
            success: "login successful",
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