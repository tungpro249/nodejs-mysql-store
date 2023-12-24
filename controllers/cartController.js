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
            'SELECT ci.*, p.name, p.image, p.price, (ci.quantity * p.price) AS total FROM cart_items ci INNER JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = ?',
            [cartId],
            (error, results) => {
                if (error) {
                    throw error;
                }
                // Tính tổng số tiền của giỏ hàng
                const totalAmount = results.reduce((total, item) => total + (item.total || 0), 0);
                res.json({ cartItems: results, totalAmount });
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

        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
        dbConn.query(
            'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
            [cartId, productId],
            (error, results) => {
                if (error) {
                    throw error;
                }

                if (results.length > 0) {
                    // Nếu sản phẩm đã tồn tại trong giỏ hàng, tăng số lượng
                    const existingCartItem = results[0];
                    const newQuantity = existingCartItem.quantity + quantity;

                    // Kiểm tra số lượng sản phẩm có sẵn trong kho
                    dbConn.query(
                        'SELECT quantity FROM products WHERE id = ?',
                        [productId],
                        (error, productResults) => {
                            if (error) {
                                throw error;
                            }

                            const availableQuantity = productResults[0].quantity;

                            if (newQuantity > availableQuantity) {
                                res.json({msg: 'Sản phẩm đã hết hàng trong kho.'});
                            } else {
                                // Cập nhật số lượng sản phẩm trong giỏ hàng
                                dbConn.query(
                                    'UPDATE cart_items SET quantity = ? WHERE id = ?',
                                    [newQuantity, existingCartItem.id],
                                    (error, results) => {
                                        if (error) {
                                            throw error;
                                        }
                                        res.json({msg: 'Số lượng giỏ hàng đã được cập nhật.'});
                                    }
                                );
                            }
                        }
                    );
                } else {
                    // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm mới
                    dbConn.query(
                        'SELECT quantity FROM products WHERE id = ?',
                        [productId],
                        (error, productResults) => {
                            if (error) {
                                throw error;
                            }

                            const availableQuantity = productResults[0].quantity;

                            if (quantity > availableQuantity) {
                                res.send('The product is out of stock.');
                            } else {
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
                            }
                        }
                    );
                }
            }
        );
    });
};

// Sửa số lượng sản phẩm trong giỏ hàng
const increaseCartItem = (req, res) => {
    const cartItemId = req.params.cartItemId;
    const { quantity } = req.body;

    // Truy vấn để lấy giá trị quantity từ cơ sở dữ liệu
    dbConn.query(
        "SELECT ci.quantity AS currentQuantity, p.quantity AS productQuantity FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.id = ?",
        [cartItemId],
        (error, results) => {
            if (error) {
                throw error;
            }

            if (results.length === 0) {
                // Không tìm thấy mặt hàng trong giỏ hàng
                res.status(404).json({ error: "Mặt hàng không tồn tại trong giỏ hàng." });
                return;
            }

            const currentQuantity = results[0].currentQuantity;
            const productQuantity = results[0].productQuantity;

            if (quantity > productQuantity) {
                // Số lượng truyền lên lớn hơn số lượng sản phẩm có sẵn trong kho
                res.status(400).json({ error: "Số lượng vượt quá số lượng sản phẩm có sẵn trong kho." });
                return;
            }

            if (quantity <= currentQuantity) {
                // Số lượng truyền lên nhỏ hơn hoặc bằng số lượng hiện tại trong giỏ hàng, không cần cập nhật
                res.status(200).json({ message: "Không cần cập nhật số lượng.", data: { quantity: currentQuantity } });
                return;
            }

            // Tiến hành cập nhật số lượng
            dbConn.query(
                "UPDATE cart_items SET quantity = ? WHERE id = ?",
                [quantity, cartItemId],
                (updateError, updateResults) => {
                    if (updateError) {
                        throw updateError;
                    }
                    res.status(200).json({ message: "Cập nhật số lượng thành công.", data: { quantity } });
                }
            );
        }
    );
};

const decreaseCartItem = (req, res) => {
    const cartItemId = req.params.cartItemId;
    const { quantity } = req.body;

    // Truy vấn để lấy giá trị quantity từ cơ sở dữ liệu
    dbConn.query(
        "SELECT ci.quantity AS currentQuantity, p.quantity AS productQuantity FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.id = ?",
        [cartItemId],
        (error, results) => {
            if (error) {
                throw error;
            }

            if (results.length === 0) {
                // Không tìm thấy mặt hàng trong giỏ hàng
                res.status(404).json({ error: "Mặt hàng không tồn tại trong giỏ hàng." });
                return;
            }

            const currentQuantity = results[0].currentQuantity;
            const productQuantity = results[0].productQuantity;

            if (quantity > currentQuantity) {
                // Số lượng truyền lên lớn hơn số lượng hiện tại trong giỏ hàng, không cần cập nhật
                res.status(400).json({ error: "Số lượng không hợp lệ." });
                return;
            }

            if (currentQuantity === 1 && quantity === 1) {
                // Số lượng hiện tại và số lượng giảm về đều là 1, không giảm thêm được nữa
                res.status(400).json({ error: "Không thể giảm số lượng thêm." });
                return;
            }

            // Tiến hành cập nhật số lượng
            const newQuantity = quantity;
            dbConn.query(
                "UPDATE cart_items SET quantity = ? WHERE id = ?",
                [newQuantity, cartItemId],
                (updateError, updateResults) => {
                    if (updateError) {
                        throw updateError;
                    }
                    res.status(200).json({ message: "Cập nhật số lượng thành công.", data: { quantity: quantity } });
                }
            );
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
    increaseCartItem,
    removeFromCart,
    getAllCarts,
    decreaseCartItem,
};