var mysql = require("mysql");
var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	//password: "root",
	database: "we-project-backend",
});

module.exports = connection;

connection.connect();
connection.query("SELECT * FROM user;", function (err, rows, fields) {
	console.log("USERS: ", JSON.stringify(rows));
});
