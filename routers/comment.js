const express = require("express");
const router = express.Router();
const {getCommentsByProduct, addComment} = require("../controllers/commentController");

router.get('/comment/:product_id', getCommentsByProduct);
router.post('/add-comment', addComment);

module.exports = router;
