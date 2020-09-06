var mysql = require("mysql");

var connection = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "",
	database: "we-project-backend",
	port: 3306,
});

connection.getConnection(function (err, connection) {
	if (err) {
		connection.release();
		console.log(" Error getting mysql_pool connection: " + err);
		throw err;
	} else {
		console.log("DB connection successful");
		connection.query("SELECT * FROM user;", function (err, rows, fields) {
			console.log("USERS: ", JSON.stringify(rows));
		});
	}
});

module.exports = connection;
