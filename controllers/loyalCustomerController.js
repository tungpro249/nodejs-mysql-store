const dbConn = require("../config");
const nodemailer = require("nodemailer");

const addCustomerAndSendEmail = async (email) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'tungt392@gmail.com',
            pass: 'gebt zvli kdry eyox',
        },
    });
    const insertQuery = 'INSERT INTO loyal_customers (email, first_name, last_name) VALUES (?, ?, ?)';
    const selectQuery = 'SELECT first_name, last_name FROM users WHERE email = ?';

    try {
        let customerFirstName = '';
        let customerLastName = '';

        // Kiểm tra xem email đã tồn tại trong bảng users hay chưa
        await new Promise((resolve, reject) => {
            dbConn.query(selectQuery, [email], (error, results) => {
                if (error) {
                    console.error('Lỗi khi kiểm tra email:', error);
                    reject(error);
                } else {
                    if (results && results.length > 0) {
                        // Nếu email đã tồn tại trong bảng users, lấy first_name và last_name
                        customerFirstName = results[0].first_name;
                        customerLastName = results[0].last_name;
                    }
                    resolve();
                }
            });
        });

        // Thêm khách hàng vào bảng loyal_customers
        await new Promise((resolve, reject) => {
            dbConn.query(insertQuery, [email, customerFirstName, customerLastName], (error, results) => {
                if (error) {
                    console.error('Lỗi khi thêm khách hàng:', error);
                    reject(error);
                } else {
                    console.log('Khách hàng đã được thêm thành công.');
                    resolve(results);
                }
            });
        });

        // Gửi email thông báo
        const mailOptions = {
            from: 'Frenzy',
            to: email,
            subject: 'Đăng ký thành công',
            text: `Chào mừng bạn đến với chương trình khách hàng thân thiết!\n\n` +
                `First Name: ${customerFirstName}\n` +
                `Last Name: ${customerLastName}`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email thông báo đã được gửi thành công:', info.response);
    } catch (error) {
        console.error('Lỗi khi thêm khách hàng hoặc gửi email thông báo:', error);
        throw error;
    }
};

const handleRegisterLoyalCustomer = async (req, res) => {
    const { email } = req.body;
    try {
        await addCustomerAndSendEmail(email);
        res.status(200).json({ message: "Success" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    handleRegisterLoyalCustomer
};