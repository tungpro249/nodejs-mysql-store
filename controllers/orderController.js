const dbConn = require("../config");
const createOrder = (req, res) => {
    try {
        const { user_id, items } = req.body;

        const orderQuery = 'INSERT INTO orders (user_id, date_created, status) VALUES (?, ?, ?)';
        const orderValues = [user_id, new Date(), 'Đang xử lý'];
        dbConn.query(orderQuery, orderValues, (error, result) => {
            if (error) {
                console.error('Lỗi khi tạo đơn hàng:', error);
                return res.status(500).json({ error: 'Đã xảy ra lỗi khi tạo đơn hàng.' });
            }

            const orderId = result.insertId;

            const orderItemsQuery = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)';

            items.forEach((item) => {
                const { product_id, quantity, price } = item;
                const orderItemsValues = [orderId, product_id, quantity, price];

                dbConn.query(orderItemsQuery, orderItemsValues, (error) => {
                    if (error) {
                        console.error('Lỗi khi tạo mặt hàng trong đơn hàng:', error);
                        return res.status(500).json({ error: 'Đã xảy ra lỗi khi tạo mặt hàng trong đơn hàng.' });
                    }
                });
            });

            // Xóa giỏ hàng sau khi đơn hàng được tạo thành công
            const deleteCartQuery = 'DELETE CASCADE FROM carts WHERE user_id = ?';
            dbConn.query(deleteCartQuery, [user_id], (error) => {
                if (error) {
                    console.error('Lỗi khi xóa giỏ hàng:', error);
                    return res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa giỏ hàng.' });
                }
            });

            res.status(201).json({ message: 'Đơn hàng đã được tạo thành công.' });
        });
    } catch (error) {
        console.error('Lỗi khi tạo đơn hàng:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi tạo đơn hàng.' });
    }
};

const getOrder = (req, res) => {
    try {
        const orderId = req.params.id;

        const orderQuery = 'SELECT * FROM orders WHERE id = ?';
        dbConn.query(orderQuery, orderId, (error, order) => {
            if (error) {
                console.error('Lỗi khi lấy thông tin đơn hàng:', error);
                return res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy thông tin đơn hàng.' });
            }

            if (order.length === 0) {
                return res.status(404).json({ error: 'Không tìm thấy đơn hàng.' });
            }

            const orderItemsQuery = 'SELECT * FROM order_items WHERE order_id = ?';
            dbConn.query(orderItemsQuery, orderId, (error, orderItems) => {
                if (error) {
                    console.error('Lỗi khi lấy thông tin mặt hàng trong đơn hàng:', error);
                    return res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy thông tin mặt hàng trong đơn hàng.' });
                }

                res.status(200).json({ order: order[0], orderItems });
            });
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin đơn hàng:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy thông tin đơn hàng.' });
    }
};

const getOrderDetails = (req, res) => {
    try {
        const userId = req.params.id;

        const query = `
      SELECT users.first_name, users.last_name, users.email, users.phone, products.name AS product_name, order_items.quantity, order_items.price, orders.status
      FROM orders
      JOIN users ON orders.user_id = users.id
      JOIN order_items ON orders.id = order_items.order_id
      JOIN products ON order_items.product_id = products.id
      WHERE users.id = ?
    `;
        dbConn.query(query, userId, (error, results) => {
            if (error) {
                console.error('Lỗi khi lấy thông tin đơn hàng:', error);
                return res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy thông tin đơn hàng.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Không tìm thấy đơn hàng.' });
            }

            const orderDetails = {
                user_name: `${results[0].first_name} ${results[0].last_name}`,
                email: results[0].email,
                phone_number: results[0].phone,
                product_name: results[0].product_name,
                quantity: results[0].quantity,
                price: results[0].price,
                status: results[0].status,
            };

            res.status(200).json({ orderDetails });
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin đơn hàng:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy thông tin đơn hàng.' });
    }
};

const getAllOrders = (req, res) => {
    try {
        const query = `
            SELECT orders.*, CONCAT(users.last_name, ' ', users.first_name) AS user_name, order_items.quantity, order_items.price, products.name AS product_name
            FROM orders
            JOIN users ON orders.user_id = users.id
            JOIN order_items ON orders.id = order_items.order_id
            JOIN products ON order_items.product_id = products.id
        `;
        dbConn.query(query, (error, results) => {
            if (error) {
                console.error('Lỗi khi lấy thông tin tất cả đơn hàng:', error);
                return res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy thông tin tất cả đơn hàng.' });
            }

            const orders = results.map((result) => {
                return {
                    id: result.id,
                    user_id: result.user_id,
                    user_name: result.user_name,
                    quantity: result.quantity,
                    price: result.price,
                    date_created: result.date_created,
                    status: result.status,
                    product_name: result.product_name,
                };
            });

            res.status(200).json({ orders });
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin tất cả đơn hàng:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy thông tin tất cả đơn hàng.' });
    }
};

const updateOrder = (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        const updateQuery = 'UPDATE orders SET status = ? WHERE id = ?';
        const updateValues = [status, orderId];

        dbConn.query(updateQuery, updateValues, (error, result) => {
            if (error) {
                console.error('Lỗi khi cập nhật đơn hàng:', error);
                return res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật đơn hàng.' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Không tìm thấy đơn hàng.' });
            }

            res.status(200).json({ message: 'Đơn hàng đã được cập nhật thành công.' });
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật đơn hàng:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật đơn hàng.' });
    }
};

const deleteOrder = (req, res) => {
    try {
        const orderId = req.params.id;

        const deleteQuery = 'DELETE FROM orders WHERE id = ?';
        const deleteValues = [orderId];

        dbConn.query(deleteQuery, deleteValues, (error, result) => {
            if (error) {
                console.error('Lỗi khi xóa đơn hàng:', error);
                return res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa đơn hàng.' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Không tìm thấy đơn hàng.' });
            }

            res.status(200).json({ message: 'Đơn hàng đã được xóa thành công.' });
        });
    } catch (error) {
        console.error('Lỗi khi xóa đơn hàng:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa đơn hàng.' });
    }
};

module.exports = {
    createOrder, getOrder, updateOrder, deleteOrder,getAllOrders, getOrderDetails
}