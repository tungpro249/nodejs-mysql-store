const dbConn = require("../config");

const getAllProducts = (req, res) => {
    dbConn.query('SELECT * FROM products', (error, results, fields) => {
        if (error) {
            console.error('Lỗi khi lấy dữ liệu sản phẩm: ' + error.stack);
            res.status(500).send('Lỗi khi lấy dữ liệu sản phẩm.');
            return;
        }
        // Trả về danh sách sản phẩm
        res.json(results);
    });
};

const getProductDetails = (req, res) => {
    const productId = req.params.id;
    const query = `SELECT * FROM products WHERE id = ?`;

    dbConn.query(query, [productId], (error, results) => {
        if (error) {
            console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
            return res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        }

        const product = results[0];
        res.json(product);
    });
};

const addNewProduct = (req, res) => {
    const { name, description, image, price, quantity, category_id } = req.body;
    const product = { name, description, image, price, quantity, category_id };

    dbConn.query('INSERT INTO products SET ?', product, (error, results, fields) => {
        if (error) {
            console.error('Lỗi khi thêm sản phẩm mới: ' + error.stack);
            res.status(500).send('Lỗi khi thêm sản phẩm mới.');
            return;
        }
        console.log('Thêm sản phẩm mới thành công.');
        // Trả về thông tin sản phẩm mới vừa thêm
        res.status(200).json({ message: 'Thêm sản phẩm mới thành công.', data: { id: results.insertId, ...product } });
    });
};

const updateProduct = (req, res) => {
    const id = req.params.id;
    const { name, description, image, price, quantity, category_id } = req.body;
    const product = { name, description, image, price, quantity, category_id };

    dbConn.query('UPDATE products SET ? WHERE id = ?', [product, id], (error, results, fields) => {
        if (error) {
            console.error('Lỗi khi cập nhật sản phẩm: ' + error.stack);
            res.status(500).send('Lỗi khi cập nhật sản phẩm.');
            return;
        }
        console.log('Cập nhật sản phẩm thành công.');
        // Trả về thông tin sản phẩm đã được cập nhật
        res.status(200).json({ message: 'Cập nhật sản phẩm thành công.', data: { id, ...product } });
    });
};

const deleteProduct = (req, res) => {
    const id = req.params.id;

    dbConn.query('DELETE FROM products WHERE id = ?', id, (error, results, fields) => {
        if (error) {
            console.error('Lỗi khi xóa sản phẩm: ' + error.stack);
            res.status(500).send('Lỗi khi xóa sản phẩm.');
            return;
        }
        console.log('Xóa sản phẩm thành công.');
        res.status(200).json({ message: 'Xóa sản phẩm thành công.' });
    });
};

module.exports = { getAllProducts, getProductDetails, addNewProduct, updateProduct, deleteProduct };