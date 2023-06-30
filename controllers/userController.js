const dbConn = require("../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const addNewUser = (req, res) => {
    const saltRounds = 10;
    const plainPassword = req.body.pass_word;
    bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
        if (err) {
            res.status(500).json({ message: "SERVER_ERROR", data: null });
        } else {
            const data = {
                email: req.body.email,
                pass_word: hashedPassword,
                last_name: req.body.last_name,
                first_name: req.body.first_name,
                phone: req.body.phone,
            };
            const selectQuery = "SELECT * FROM users WHERE email = ?";
            dbConn.query(selectQuery, data.email, (err, results) => {
                if (err) {
                    res.status(500).json({ message: "SERVER_ERROR", data: null });
                } else if (results.length > 0) {
                    res.status(400).json({ message: "EMAIL_ALREADY_EXISTS", data: null });
                } else {
                    const insertQuery = "INSERT INTO users SET ?";
                    dbConn.query(insertQuery,data, (err, results) => {
                        if (err) {
                            res.status(500).json({ message: "SERVER_ERROR", data: null });
                        } else {
                            res.status(201).json({ message: "ADD_USER_SUCCESS", data: data });
                        }
                    });
                }
            });
        }
    });
};

const loginUser = (req, res) => {
    const { email, pass_word } = req.body;
    const sqlQuery = "SELECT * FROM users WHERE email = ?";
    dbConn.query(sqlQuery, email, async (err, results) => {
        if (err) {
            res.status(500).json({ message: "SERVER_ERROR" });
        } else if (results.length === 0) {
            res.status(401).json({ code: 0, message: "EMAIL_OR_PASSWORD_ERROR" });
        } else {
            const hashedPassword = results[0].pass_word;
            bcrypt.compare(pass_word, hashedPassword, (err, isMatch) => {
                if (err) {
                    res.status(500).json({ code: 0,message: "SERVER_ERROR" });
                } else if (!isMatch) {
                    res.status(401).json({code: 0, message: "EMAIL_OR_PASSWORD_ERROR" });
                } else {
                    const data = {
                        email: results[0].email,
                        last_name: results[0].last_name,
                        first_name: results[0].first_name,
                        phone: results[0].phone,
                    };
                    const token = jwt.sign({ data }, process.env.SECRET_KEY, { expiresIn: "1h" });
                    res.status(200).json({ code: 1, message: "LOGIN_SUCCESS", token: token, data: data });
                }
            });
        }
    });
};

module.exports = {  addNewUser, loginUser };
