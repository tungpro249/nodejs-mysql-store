const dbConn = require("../config");

const getAllProducts = (req, res) => {
    dbConn.query('SELECT * FROM products', (error, results, fields) => {
        if (error) {
            console.error('Lỗi khi lấy dữ liệu sản phẩm: ' + error.stack);
            res.status(500).send('Lỗi khi lấy dữ liệu sản phẩm.');
            return;
        }
        console.log('Lấy dữ liệu sản phẩm thành công.');
        // Trả về danh sách sản phẩm
        res.json(results);
    });
};

const addNewProduct = (req, res) => {
    const {name, description, image, price, quantity, category_id} = req.body;
    const product = {name, description, image, price, quantity, category_id};
    console.log(product)
    dbConn.query('INSERT INTO products SET ?', product, (error, results, fields) => {
        if (error) {
            console.error('Lỗi khi thêm sản phẩm mới: ' + error.stack);
            res.status(500).send('Lỗi khi thêm sản phẩm mới.');
            return;
        }
        console.log('Thêm sản phẩm mới thành công.');
        // Trả về thông tin sản phẩm mới vừa thêm
        res.json({id: results.insertId, ...product});
    })
}

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
        res.json({ id, ...product });
    });
}
const deleteProduct = (req, res) => {
    console.log("dcm vao day")
    const id = req.params.id;
    dbConn.query('DELETE FROM products WHERE id = ?', id, (error, results, fields) => {
        if (error) {
            console.error('Lỗi khi xóa sản phẩm: ' + error.stack);
            res.status(500).send('Lỗi khi xóa sản phẩm.');
            return;
        }
        console.log('Xóa sản phẩm thành công.');
        res.sendStatus(200);
    });
};

module.exports = {  getAllProducts, addNewProduct, updateProduct, deleteProduct };
