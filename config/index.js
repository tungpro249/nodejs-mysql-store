const mysql = require("mysql");
const createTables = require('./initDB');
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "tungpro249",
  database: "testdb",
});

connection.connect((error) => {
  if (!!error) {
    console.log(error);
  } else {
    console.log("Database Connected Successfully..!!");
    createTables(connection);
  }
});

module.exports = connection;