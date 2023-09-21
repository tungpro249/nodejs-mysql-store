const dbConn = require("../config");

const getCart = (req, res) => {
    const userId = req.params.userId;
    dbConn.query('SELECT * FROM cart WHERE user_id = ?', userId, (error, results, fields) => {
        if (error) {
            console.error('Lỗi khi truy vấn thông tin giỏ hàng: ' + error.stack);
            res.status(500).json({ message: 'Lỗi khi truy vấn thông tin giỏ hàng.' });
            return;
        }
        res.status(200).json({ message: 'Lấy thông tin giỏ hàng thành công.', data: results });
    });
};

const addNewCart = (req, res) => {
    const { user_id } = req.body;
    const cart = { user_id };
    dbConn.query('INSERT INTO cart SET ?', cart, (error, results, fields) => {
        if (error) {
            console.error('Lỗi khi thêm giỏ hàng mới: ' + error.stack);
            res.status(500).json({ message: 'Lỗi khi thêm giỏ hàng mới.' });
            return;
        }
        const newCart = { id: results.insertId, ...cart };
        res.status(200).json({ message: 'Thêm giỏ hàng mới thành công.', data: newCart });
    });
}

const updateCart = (req, res) => {
    const id = req.params.id;
    const { user_id } = req.body;
    const cart = { user_id };
    dbConn.query('UPDATE cart SET ? WHERE id = ?', [cart, id], (error, results, fields) => {
        if (error) {
            console.error('Lỗi khi cập nhật giỏ hàng: ' + error.stack);
            res.status(500).json({ message: 'Lỗi khi cập nhật giỏ hàng.' });
            return;
        }
        const updatedCart = { id, ...cart };
        res.status(200).json({ message: 'Cập nhật giỏ hàng thành công.', data: updatedCart });
    });
}

const deleteCart = (req, res) => {
    const id = req.params.id;
    dbConn.query('DELETE FROM cart WHERE id = ?', id, (error, results, fields) => {
        if (error) {
            console.error('Lỗi khi xóa giỏ hàng: ' + error.stack);
            res.status(500).json({ message: 'Lỗi khi xóa giỏ hàng.' });
            return;
        }
        res.status(200).json({ message: 'Xóa giỏ hàng thành công.', data: [] });
    });
};

const updateCartItemQuantity = (req, res) => {
    const cartId = req.params.cartId;
    const { quantity } = req.body;
    const updatedCartItem = { quantity };
    dbConn.query('UPDATE cart_items SET ? WHERE id = ?', [updatedCartItem, cartId], (error, results, fields) => {
        if (error) {
            console.error('Lỗi khi cập nhật số lượng mặt hàng trong giỏ hàng: ' + error.stack);
            res.status(500).json({ message: 'Lỗi khi cập nhật số lượng mặt hàng trong giỏ hàng.' });
            return;
        }
        res.status(200).json({ message: 'Cập nhật số lượng mặt hàng thành công.', data: updatedCartItem });
    });
};

const calculateCartTotal = (req, res) => {
    const cartId = req.params.cartId;
    dbConn.query('SELECT SUM(quantity * price) AS total FROM cart_items WHERE cart_id = ?', cartId, (error, results, fields) => {
        if (error) {
            console.error('Lỗi khi tính toán tổng cộng giỏ hàng: ' + error.stack);
            res.status(500).json({ message: 'Lỗi khi tính toán tổng cộng giỏ hàng.' });
            return;
        }
        const total = results[0].total || 0;
        res.status(200).json({ message: 'Tính toán tổng cộng giỏ hàng thành công.', data: { total } });
    });
};

const processPayment = (req, res) => {
    const cartId = req.params.cartId;
    // Thực hiện xử lý thanh toán tại đây
    // ...
    res.status(200).json({ message: 'Xử lý thanh toán thành công.' });
};

module.exports = { addNewCart, updateCart, deleteCart, getCart, updateCartItemQuantity, calculateCartTotal };