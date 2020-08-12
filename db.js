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

// connection.query("SELECT * FROM user;", function (err, rows, fields) {
//   console.log("USERS: ", JSON.stringify(rows));
// });

// var sql = require("mssql");

// // Create a configuration object for our Azure SQL connection parameters
// var dbConfig = {
//   server: "tcp:hamzashahab1610.database.windows.net", // Use your SQL server name
//   database: "we-project-backend", // Database to connect to
//   user: "hamzashahab1610", // Use your username
//   password: "Squirtle2000", // Use your password
//   port: 1433,
//   // Since we're on Windows Azure, we need to set the following options
//   options: {
//     encrypt: true,
//   },
// };

// // This function connects to a SQL server, executes a SELECT statement,
// // and displays the results in the console.
// function getCustomers() {
//  // Create connection instance
//  var conn = new sql.Connection(dbConfig);

//  conn.connect()
//  // Successfull connection
//  .then(function () {

//    // Create request instance, passing in connection instance
//    var req = new sql.Request(conn);

//    // Call mssql's query method passing in params
//    req.query("SELECT * FROM user")
//    .then(function (recordset) {
//      console.log(recordset);
//      conn.close();
//    })
//    // Handle sql statement execution errors
//    .catch(function (err) {
//      console.log(err);
//      conn.close();
//    })

//  })
//  // Handle connection errors
//  .catch(function (err) {
//    console.log(err);
//    conn.close();
//  });
// }

// getCustomers();
// module.exports = conn;
