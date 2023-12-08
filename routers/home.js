const express = require("express");
const dbConn = require("../config");
const router = express.Router();

router.get("/stats", (req, res) => {
    const query = `
        SELECT
            (SELECT COUNT(*) FROM orders) AS totalOrders,
            (SELECT COUNT(*) FROM products) AS totalProducts,
            (SELECT COUNT(*) FROM users) AS totalUsers,
            (SELECT SUM(order_items.quantity * order_items.price) 
             FROM order_items 
             JOIN orders ON order_items.order_id = orders.id 
             WHERE orders.status = 'đã thanh toán') AS totalRevenue
    `;

    dbConn.query(query, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.sendStatus(500);
            return;
        }

        const stats = {
            totalOrders: result[0].totalOrders,
            totalProducts: result[0].totalProducts,
            totalUsers: result[0].totalUsers - 1,
            totalRevenue: result[0].totalRevenue || 0,
        };
        res.json(stats);
    });
});

router.get('/total-incomes', (req, res) => {
    const query = `
    SELECT MONTH(o.date_created) AS month, SUM(oi.price * oi.quantity) AS total_income
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.status = 'Đã thanh toán'
    GROUP BY MONTH(o.date_created)
  `;

    dbConn.query(query, (error, results) => {
        if (error) {
            console.error('Lỗi truy vấn cơ sở dữ liệu: ' + error.stack);
            res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
            return;
        }

        const monthlyIncome = Array.from({ length: 12 }, () => 0);
        results.forEach((row) => {
            const monthIndex = row.month - 1;
            monthlyIncome[monthIndex] = row.total_income;
        });

        const data = {
            labels: [
                "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
                "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
            ],
            datasets: [
                {
                    label: "Tổng tiền mỗi tháng",
                    data: monthlyIncome,
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                },
            ],
        };

        res.status(200).json(data);
    });
});

module.exports = router;
