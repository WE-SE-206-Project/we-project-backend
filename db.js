var mysql = require("mysql");

var connection = mysql.createPool({
  host: "we-project-backend.mysql.database.azure.com",
  user: "hamzashahab1610@we-project-backend",
  password: "Admin123",
  database: "we-project-backend",
  port: 3306,
  ssl: {
    // DO NOT DO THIS
    // set up your ca correctly to trust the connection
    rejectUnauthorized: false,
  },
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