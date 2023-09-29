const dbConn = require("../config");

const createOrder = (req, res) => {
    try {
        const { userId, items } = req.body;

        const orderQuery = 'INSERT INTO orders (user_id, date_created, status) VALUES (?, ?, ?)';
        const orderValues = [userId, new Date(), 'Đang xử lý'];

        dbConn.query(orderQuery, orderValues, (error, result) => {
            if (error) {
                console.error('Lỗi khi tạo đơn hàng:', error);
                return res.status(500).json({ error: 'Đã xảy ra lỗi khi tạo đơn hàng.' });
            }

            const orderId = result.insertId;

            const orderItemsQuery = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)';

            items.forEach((item) => {
                const { productId, quantity, price } = item;
                const orderItemsValues = [orderId, productId, quantity, price];

                db.query(orderItemsQuery, orderItemsValues, (error) => {
                    if (error) {
                        console.error('Lỗi khi tạo mặt hàng trong đơn hàng:', error);
                        return res.status(500).json({ error: 'Đã xảy ra lỗi khi tạo mặt hàng trong đơn hàng.' });
                    }
                });
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
            db.query(orderItemsQuery, orderId, (error, orderItems) => {
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
    createOrder, getOrder, updateOrder, deleteOrder
}