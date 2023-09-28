const dbConn = require("../config");

// Thêm một sản phẩm vào giỏ hàng
const addItemToCart = (req, res) => {
    const { cartId, productId, quantity } = req.body;

    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    const sqlCheckExistingItem = 'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?';
    dbConn.query(sqlCheckExistingItem, [cartId, productId], (error, results) => {
        if (error) {
            console.error('Lỗi khi kiểm tra sản phẩm trong giỏ hàng: ' + error.stack);
            res.status(500).json({ message: 'Lỗi khi kiểm tra sản phẩm trong giỏ hàng' });
            return;
        }

        if (results.length > 0) {
            const existingItem = results[0];
            // Sản phẩm đã tồn tại, cập nhật số lượng
            const newQuantity = existingItem.quantity + quantity;
            const sqlUpdateQuantity = 'UPDATE cart_items SET quantity = ? WHERE id = ?';
            dbConn.query(sqlUpdateQuantity, [newQuantity, existingItem.id], (error) => {
                if (error) {
                    console.error('Lỗi khi cập nhật số lượng mặt hàng trong giỏ hàng: ' + error.stack);
                    res.status(500).json({ message: 'Lỗi khi cập nhật số lượng mặt hàng trong giỏ hàng' });
                    return;
                }
                res.status(200).json({ message: 'Cập nhật số lượng mặt hàng trong giỏ hàng thành công' });
            });
        } else {
            // Sản phẩm chưa tồn tại, tạo mặt hàng mới
            const sqlInsertItem = 'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)';
            dbConn.query(sqlInsertItem, [cartId, productId, quantity], (error) => {
                if (error) {
                    console.error('Lỗi khi thêm mặt hàng vào giỏ hàng: ' + error.stack);
                    res.status(500).json({ message: 'Lỗi khi thêm mặt hàng vào giỏ hàng' });
                    return;
                }
                res.status(201).json({ message: 'Thêm mặt hàng vào giỏ hàng thành công' });
            });
        }
    });
};

// Cập nhật số lượng mặt hàng trong giỏ hàng
const updateCartItemQuantity = (req, res) => {
    const itemId = req.params.id;
    const { quantity } = req.body;

    const sqlUpdateQuantity = 'UPDATE cart_items SET quantity = ? WHERE id = ?';
    dbConn.query(sqlUpdateQuantity, [quantity, itemId], (error) => {
        if (error) {
            console.error('Lỗi khi cập nhật số lượng mặt hàng trong giỏ hàng: ' + error.stack);
            res.status(500).json({ message: 'Lỗi khi cập nhật số lượng mặt hàng trong giỏ hàng' });
            return;
        }
        res.status(200).json({ message: 'Cập nhật số lượng mặt hàng trong giỏ hàng thành công' });
    });
};

// Xóa một mặt hàng khỏi giỏ hàng
const removeItemFromCart = (req, res) => {
    const itemId = req.params.id;

    const sqlDeleteItem = 'DELETE FROM cart_items WHERE id = ?';
    dbConn.query(sqlDeleteItem, [itemId], (error) => {
        if (error) {
            console.error('Lỗi khi xóa mặt hàng khỏi giỏ hàng: ' + error.stack);
            res.status(500).json({ message: 'Lỗi khi xóa mặt hàng khỏi giỏ hàng' });
            return;
        }
        res.status(200).json({ message: 'Xóa mặt hàng khỏi giỏ hàng thành công' });
    });
};

// Lấy danh sách mặt hàng trong giỏ hàng
const getCartItems = (req, res) => {
    const cartId = req.params.id;

    const sqlGetCartItems = 'SELECT * FROM cart_items WHERE cart_id = ?';
    dbConn.query(sqlGetCartItems, [cartId], (error, results) => {
        if (error) {
            console.error('Lỗi khi lấy danh sách mặt hàng trong giỏ hàng: ' + error.stack);
            res.status(500).json({ message: 'Lỗi khi lấy danh sách mặt hàng trong giỏ hàng' });
            return;
        }
        res.status(200).json(results);
    });
};

module.exports = {
    addItemToCart,
    updateCartItemQuantity,
    removeItemFromCart,
    getCartItems
};