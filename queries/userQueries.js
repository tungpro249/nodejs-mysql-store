const dbConn = require("../config");

// thực hiện các truy vấn liên quan đến bảng users.

const selectUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const selectQuery = "SELECT * FROM users WHERE email = ?";
    dbConn.query(selectQuery, email, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const insertUser = (data) => {
  return new Promise((resolve, reject) => {
    const insertQuery = "INSERT INTO users SET ?";
    dbConn.query(insertQuery, data, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  selectUserByEmail,
  insertUser,
};
