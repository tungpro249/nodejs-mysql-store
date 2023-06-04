const dbConn = require("../config");

const getAllCategories = (req, res) => {
    dbConn.query('SELECT * FROM categories', (error, results, fields) => {
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

const addNewCategory = (req, res) => {
    const { name } = req.body;
    const category = { name };
    dbConn.query('INSERT INTO categories SET ?', category, (error, results, fields) => {
        if (error) {
            console.error('Lỗi khi thêm sản phẩm mới: ' + error.stack);
            res.status(500).send('Lỗi khi thêm sản phẩm mới.');
            return;
        }
        console.log('Thêm sản phẩm mới thành công.');
        // Trả về thông tin sản phẩm mới vừa thêm
        res.json({id: results.insertId, ...category});
    })
}

const updateCategory = (req, res) => {
    const id = req.params.id;
    const { name } = req.body;
    const product = { name };
    dbConn.query('UPDATE categories SET ? WHERE id = ?', [product, id], (error, results, fields) => {
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

module.exports = {  getAllCategories, addNewCategory, updateCategory };
