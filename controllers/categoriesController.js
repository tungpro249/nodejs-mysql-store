const dbConn = require("../config");
const uploadFile = require("../middleware/uploadMiddleware");

const upload = uploadFile("categories");

const getAllCategories = (req, res) => {
  dbConn.query("SELECT * FROM categories", (error, results, fields) => {
    if (error) {
      console.error("Lỗi khi lấy dữ liệu sản phẩm: " + error.stack);
      res.status(500).send("Lỗi khi lấy dữ liệu sản phẩm.");
      return;
    }
    console.log("Lấy dữ liệu sản phẩm thành công.");
    // Trả về danh sách sản phẩm
    res.json(results);
  });
};

const addNewCategory = (req, res) => {
  const { name } = req.body;
  const category = { name };
  if (req.file) {
    const imageUrl = req.file.path;
    category.image = `${imageUrl}`;
  }

  dbConn.query(
    "INSERT INTO categories SET ?",
    category,
    (error, results, fields) => {
      if (error) {
        console.error("Lỗi khi thêm sản phẩm mới: " + error.stack);
        res.status(500).send("Lỗi khi thêm sản phẩm mới.");
        return;
      }
      console.log("category", category);
      // Trả về thông tin sản phẩm mới vừa thêm
      res.json({ id: results.insertId, ...category });
    },
  );
};

const updateCategory = (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  const product = { name };
  dbConn.query(
    "UPDATE categories SET ? WHERE id = ?",
    [product, id],
    (error, results, fields) => {
      if (error) {
        console.error("Lỗi khi cập nhật sản phẩm: " + error.stack);
        res.status(500).send("Lỗi khi cập nhật sản phẩm.");
        return;
      }
      console.log("Cập nhật sản phẩm thành công.");
      // Trả về thông tin sản phẩm đã được cập nhật
      res.json({ id, ...product });
    },
  );
};

const deleteCategory = (req, res) => {
  const id = req.params.id;
  dbConn.query(
    "DELETE FROM categories WHERE id = ?",
    id,
    (error, results, fields) => {
      if (error) {
        console.error("Lỗi khi xóa danh mục: " + error.stack);
        res.status(500).send("Lỗi khi xóa danh mục.");
        return;
      }
      console.log("Xóa danh mục thành công.");
      res.status(200).json({ message: "Xóa danh mục thành công." });
    },
  );
};
module.exports = {
  getAllCategories,
  addNewCategory,
  updateCategory,
  deleteCategory,
  upload,
};
