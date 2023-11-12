const express = require("express");
const dbConn = require("../config");
const router = express.Router();

router.get("/stats", (req, res) => {
    const query = `
    SELECT
      (SELECT COUNT(*) FROM orders) AS totalOrders,
      (SELECT COUNT(*) FROM products) AS totalProducts,
      (SELECT COUNT(*) FROM users) AS totalUsers,
      (SELECT SUM(quantity * price) FROM order_items) AS totalRevenue
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
            totalUsers: result[0].totalUsers,
            totalRevenue: result[0].totalRevenue,
        };

        res.json(stats);
    });
});

module.exports = router;
