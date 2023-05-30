const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "tungpro249",
    database: "testdb",
});
connection.connect(function (error) {
    if (!!error) {
        console.log(error);
    } else {
        console.log("Database Connected Successfully..!!");
    }
});

module.exports = connection;
