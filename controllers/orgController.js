require("dotenv").config();
var bcrypt = require("bcrypt");
var validator = require("email-validator");
var sql = require("../db");
var jwt = require("jsonwebtoken");

var Org = require("../models/orgModel");

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1800s",
  });
}

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
  var name = req.body.name;
  var email = req.body.email;
  var phone = req.body.phone;
  var password = req.body.password;
  var hashedPassword = bcrypt.hashSync(password, saltRounds);

  var newOrg = {
    name: name,
    email: email,
    phone: phone,
    password: hashedPassword,
  };

  Org.createOrg(newOrg, function (err, org) {
     console.log("user created");
    if (err) {
      res.send({ status: false });
      //res.send(err);
    }
    console.log("res", org);
    res.send({ status: true });
    //res.send(user);
  });
};

exports.update_org = function (req, res) {
  var saltRounds = 10;
  var name = req.body.name;
  var email = req.body.email;
  var phone = req.body.phone;
  var password = req.body.password;
  var hashedPassword = bcrypt.hashSync(password, saltRounds);

  var newOrg = {
    name: name,
    email: email,
    phone: phone,
    password: hashedPassword,
  };

  Org.updateOrg(newOrg, function (err, org) {
    console.log("Organization updated");
    if (err) res.send(err);
    console.log("res", org);
    res.send(org);
  });
};

exports.login = function (req, res) {
  //   var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;

  const mail = { email: email };
  const accessToken = generateAccessToken(mail);

  sql.query("SELECT * FROM organization WHERE email = ?", [email], function (
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
          results[0].name.length >= 0
        ) {
          console.log("The solution is: ", results);          
          
          res.status(200).send({
            code: 200,
            success: "login successful",
            results: results,
            accessToken: accessToken,
          });
          //next();
        } else {
          res.status(204).send({
            code: 204,
            success: "Email and password does not match"
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
