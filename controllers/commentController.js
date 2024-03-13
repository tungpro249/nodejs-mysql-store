const dbConn = require("../config");

const getCommentsByProduct = (req, res) => {
    const productId = req.params.product_id;
    const query = `SELECT * FROM comments WHERE product_id = ?`;

    dbConn.query(query, [productId], (err, results) => {
        if (err) {
            console.error('Lỗi khi lấy danh sách comment:', err);
            res.status(500).json({ error: 'Lỗi khi lấy danh sách comment' });
            return;
        }
        res.json(results);
    });
};

const addComment = (req, res) => {
    const { userId, productId, comment } = req.body;
    const query = `INSERT INTO comments (user_id, product_id, comment, date_created)
                 VALUES (?, ?, ?, NOW())`;
    const values = [userId, productId, comment];

    dbConn.query(query, values, (err, results) => {
        if (err) {
            console.error('Lỗi khi thêm comment:', err);
            res.status(500).json({ error: 'Lỗi khi thêm comment' });
            return;
        }
        res.status(200).json({ message: 'Comment đã được thêm thành công'});
    });
};

module.exports = {
    getCommentsByProduct,
    addComment
}