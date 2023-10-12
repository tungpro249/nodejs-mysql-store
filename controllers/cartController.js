const dbConn = require("../config");

// Tạo giỏ hàng mới cho người dùng
const createCart = (userId, callback) => {
    const cart = {
        user_id: userId,
    };

    dbConn.query('INSERT INTO carts SET ?', cart, (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results.insertId);
        }
    });
};

// Lấy cartId của giỏ hàng của người dùng
const getCartId = (userId, callback) => {
    dbConn.query(
        'SELECT id FROM carts WHERE user_id = ?',
        [userId],
        (error, results) => {
            if (error) {
                callback(error, null);
            } else {
                if (results.length > 0) {
                    callback(null, results[0].id);
                } else {
                    // Nếu không tìm thấy giỏ hàng, tạo giỏ hàng mới và trả về cartId
                    createCart(userId, callback);
                }
            }
        }
    );
};

// Lấy thông tin giỏ hàng của người dùng
const getCart = (req, res) => {
    const userId = req.params.userId;

    getCartId(userId, (error, cartId) => {
        if (error) {
            throw error;
        }
        dbConn.query(
            'SELECT * FROM cart_items WHERE cart_id = ?',
            [cartId],
            (error, results) => {
                if (error) {
                    throw error;
                }
                res.json(results);
            }
        );
    });
};

// Thêm sản phẩm vào giỏ hàng
const addToCart = (req, res) => {
    const userId = req.params.userId;
    const { productId, quantity } = req.body;

    getCartId(userId, (error, cartId) => {
        if (error) {
            throw error;
        }
        dbConn.query(
            'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
            [cartId, productId, quantity],
            (error, results) => {
                if (error) {
                    throw error;
                }
                res.send('Product added to cart successfully.');
            }
        );
    });
};

// Sửa số lượng sản phẩm trong giỏ hàng
const updateCartItem = (req, res) => {
    const cartItemId = req.params.cartItemId;
    const { quantity } = req.body;

    dbConn.query(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [quantity, cartItemId],
        (error, results) => {
            if (error) {
                throw error;
            }
            res.send('Cart item updated successfully.');
        }
    );
};

// Xóa sản phẩm khỏi giỏ hàng
const removeFromCart = (req, res) => {
    const cartItemId = req.params.cartItemId;

    dbConn.query(
        'DELETE FROM cart_items WHERE id = ?',
        [cartItemId],
        (error, results) => {
            if (error) {
                throw error;
            }
            res.send('Product removed from cart successfully.');
        }
    );
};

// Lấy tất cả giỏ hàng
const getAllCarts = (req, res) => {
    dbConn.query('SELECT * FROM carts', (error, results) => {
        if (error) {
            throw error;
        }
        res.json(results);
    });
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    getAllCarts,
};