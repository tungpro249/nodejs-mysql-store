const dbConn = require("../config");

const addNewCart = (req, res) => {
    const { user_id } = req.body;
    const cart = { user_id };
    dbConn.query('INSERT INTO cart SET ?', cart, (error, results, fields) => {
        if (error) {
            console.error('Lỗi khi thêm giỏ hàng mới: ' + error.stack);
            res.status(500).send('Lỗi khi thêm giỏ hàng mới.');
            return;
        }
        console.log('Thêm giỏ hàng mới thành công.');
        // Trả về thông tin giỏ hàng mới vừa thêm
        res.json({ id: results.insertId, ...cart });
    });
}

const updateCart = (req, res) => {
    const id = req.params.id;
    const { user_id } = req.body;
    const cart = { user_id };
    dbConn.query('UPDATE cart SET ? WHERE id = ?', [cart, id], (error, results, fields) => {
        if (error) {
            console.error('Lỗi khi cập nhật giỏ hàng: ' + error.stack);
            res.status(500).send('Lỗi khi cập nhật giỏ hàng.');
            return;
        }
        console.log('Cập nhật giỏ hàng thành công.');
        // Trả về thông tin giỏ hàng đã được cập nhật
        res.json({ id, ...cart });
    });
}

const deleteCart = (req, res) => {
    const id = req.params.id;
    dbConn.query('DELETE FROM cart WHERE id = ?', id, (error, results, fields) => {
        if (error) {
            console.error('Lỗi khi xóa giỏ hàng: ' + error.stack);
            res.status(500).send('Lỗi khi xóa giỏ hàng.');
            return;
        }
        console.log('Xóa giỏ hàng thành công.');
        res.status(200).json({ "message": "Xóa giỏ hàng thành công." });
    });
};

module.exports = { addNewCart, updateCart, deleteCart };