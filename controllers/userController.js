const { hashPassword, comparePassword } = require("../utils/authUtils");
const { selectUserByEmail, insertUser } = require("../queries/userQueries");
const dbConn = require("../config");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require('crypto');

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
            id: user[0].id,
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

// Hàm kiểm tra email có tồn tại trong cơ sở dữ liệu không
const checkEmailExists = (email) => {
    return new Promise((resolve, reject) => {
        dbConn.query(
            'SELECT * FROM users WHERE email = ?',
            [email],
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.length > 0);
                }
            }
        );
    });
};

// Function to generate a reset token and save it in the user's generate_code field
const generateResetToken = async (email) => {
    try {
        const resetToken = crypto.randomBytes(20).toString('hex'); // Generate a random token
        const updateSql = 'UPDATE users SET generate_code = ? WHERE email = ?';

        await dbConn.query(updateSql, [resetToken, email]); // Save the reset token to the generate_code field

        return resetToken;
    } catch (error) {
        throw new Error('Failed to generate reset token: ' + error.message);
    }
};

// Hàm kiểm tra tính hợp lệ của resetToken
const validateResetToken = (resetToken) => {
    // Tạo logic kiểm tra tính hợp lệ của resetToken dựa trên yêu cầu của bạn
};

// Hàm cập nhật mật khẩu mới cho người dùng
const updatePassword = (email, newPassword) => {
    return new Promise((resolve, reject) => {
        dbConn.query(
            'UPDATE users SET password = ? WHERE email = ?',
            [newPassword, email],
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            }
        );
    });
};

// Hàm gửi email khôi phục mật khẩu
const sendPasswordResetEmail = async (email, resetToken) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.YOUR_EMAIL,
            pass: process.env.YOUR_PASS_OF_APP,
        },
    });
    const resetLink = `http://localhost:3000/reset-password?email=${email}&resetToken=${resetToken}`
    const mailOptions = {
        from: 'Đoàn Thanh Tùng',
        to: email,
        subject: 'Khôi phục mật khẩu',
        text: `Vui lòng truy cập đường dẫn sau để khôi phục mật khẩu:`,
        html: `Click <a href="${resetLink}">here</a> to reset your password.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu không
        const emailExists = await checkEmailExists(email);
        if (!emailExists) {
            return res.status(404).json({ message: 'EMAIL_NOT_FOUND' });
        }

        // Tạo một mã token để khôi phục mật khẩu
        const resetToken = await generateResetToken(email);

        // Gửi email khôi phục mật khẩu đến người dùng
        await sendPasswordResetEmail(email, resetToken);

        res.status(200).json({ message: 'RESET_EMAIL_SENT' });
    } catch (error) {
        console.error('Error requesting password reset:', error);
        res.status(500).json({ message: 'SERVER_ERROR' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, resetToken, newPassword } = req.body;

        const emailExists = await checkEmailExists(email);
        if (!emailExists) {
            return res.status(404).json({ message: 'USER_NOT_FOUND' });
        }

        // Kiểm tra tính hợp lệ của resetToken (thêm logic vào hàm validateResetToken)

        const selectSql = 'SELECT * FROM users WHERE email = ? AND generate_code = ?';
        const [rows] = await dbConn.query(selectSql, [email, resetToken]);
        if (rows.length === 0) {
            return res.status(400).json({ message: 'INVALID_RESET_TOKEN' });
        }

        await updatePassword(email, newPassword); // Update thepassword directly using the email

        // Clear the generate_code field after password reset
        const updateSql = 'UPDATE users SET generate_code = NULL WHERE email = ?';
        await dbConn.query(updateSql, [email]);

        res.status(200).json({ message: 'PASSWORD_RESET_SUCCESSFUL' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'SERVER_ERROR' });
    }
};

const changeInfo = (req, res) => {
        const { id } = req.params; // Lấy id từ URL
    console.log(id)
        const { phone, first_name, last_name } = req.body;

        const query = 'UPDATE users SET phone = ?, first_name = ?, last_name = ? WHERE id = ?';

        // Thực thi câu truy vấn SQL
         dbConn.query(query, [phone, first_name, last_name, id], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Lỗi server');
            } else {
                res.send('Thông tin người dùng đã được cập nhật thành công');
            }
        });
};

module.exports = {
    addNewUser,
    loginUser,
    changePassword,
    forgotPassword,
    resetPassword,
    changeInfo
};