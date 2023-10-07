const { hashPassword, comparePassword } = require("../utils/authUtils");
const { selectUserByEmail, insertUser } = require("../queries/userQueries");
const dbConn = require("../config");
const jwt = require("jsonwebtoken");

const saltRounds = 10;
const secretKey = process.env.SECRET_KEY;

const addNewUser = async (req, res) => {
    try {
        const plainPassword = req.body.pass_word;
        const hashedPassword = await hashPassword(plainPassword, saltRounds);
        const data = {
            email: req.body.email,
            pass_word: hashedPassword,
            last_name: req.body.last_name,
            first_name: req.body.first_name,
            phone: req.body.phone,
        };

        const existingUser = await selectUserByEmail(data.email);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "EMAIL_ALREADY_EXISTS", data: null });
        }

        await insertUser(data);
        res.status(201).json({ message: "ADD_USER_SUCCESS", data });
    } catch (error) {
        console.error("Error adding new user:", error);
        res.status(500).json({ message: "SERVER_ERROR", data: null });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, pass_word } = req.body;

        const user = await selectUserByEmail(email);
        if (user.length === 0) {
            return res.status(401).json({ code: 0, message: "EMAIL_OR_PASSWORD_ERROR" });
        }

        const hashedPassword = user[0].pass_word;
        const isMatch = await comparePassword(pass_word, hashedPassword);
        if (!isMatch) {
            return res.status(401).json({ code: 0, message: "EMAIL_OR_PASSWORD_ERROR" });
        }

        const data = {
            email: user[0].email,
            last_name: user[0].last_name,
            first_name: user[0].first_name,
            phone: user[0].phone,
        };

        if (user[0].role === 1) {
            data.isAdmin = true;
        } else {
            data.isAdmin = false;
        }

        const token = jwt.sign({ data }, secretKey, { expiresIn: "1h" });
        res.status(200).json({ code: 1, message: "LOGIN_SUCCESS", token, data });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ code: 0, message: "SERVER_ERROR" });
    }
};

const changePassword = async (req, res) => {
    try {
        const { email, old_password, new_password } = req.body;
        // Lệnh SQL để lấy mật khẩu hiện tại từ cơ sở dữ liệu
        const selectSql = `SELECT pass_word FROM users WHERE email = ?`;

        dbConn.query(selectSql, email, async (error, results) => {
            if (error) {
                console.error("Error selecting user password:", error);
                res.status(500).json({ message: "SERVER_ERROR", data: null });
            } else {
                if (results.length === 0) {
                    return res.status(401).json({ message: "Người dùng không tồn tại" });
                }

                const hashedPassword = results[0].pass_word;

                // Kiểm tra old_password với mật khẩu hiện tại từ cơ sở dữ liệu
                const isMatch = await comparePassword(old_password, hashedPassword);
                if (!isMatch) {
                    return res.status(401).json({ message: "Mật khẩu cũ không đúng" });
                }

                // Lệnh SQL để cập nhật mật khẩu mới
                const updateSql = `UPDATE users SET pass_word = ? WHERE email = ?`;
                const hashedNewPassword = await hashPassword(new_password, saltRounds);
                const updateValues = [hashedNewPassword, email];

                dbConn.query(updateSql, updateValues, (error, results) => {
                    if (error) {
                        console.error("Error changing password:", error);
                        res.status(500).json({ message: "SERVER_ERROR" });
                    } else {
                        res.status(200).json({ message: "Thay đổi mật khẩu thành công" });
                    }
                });
            }
        });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "SERVER_ERROR" });
    }
};

module.exports = {
    addNewUser,
    loginUser,
    changePassword
};