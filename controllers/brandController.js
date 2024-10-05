const dbConn = require("../config");
const uploadFile = require("../middleware/uploadMiddleware");

const upload = uploadFile("brands");

const getAllBrands = (req, res) => {
  dbConn.query("SELECT * FROM brands", (error, results, fields) => {
    if (error) {
      console.error("Lỗi khi lọc thương hiệu: " + error.stack);
      res.status(500).send("Lỗi khi lọc thương hiệu");
      return;
    }
    res.json(results);
  });
};

const addNewBrand = (req, res) => {
  const { name } = req.body;
  const brand = { name };

  // Kiểm tra xem có file ảnh được upload hay không
  if (req.file) {
    const imageUrl = req.file.path;
    brand.logo = imageUrl;
  }

  dbConn.query("INSERT INTO brands SET ?", brand, (error, results, fields) => {
    if (error) {
      console.error("Lỗi khi thêm thương hiệu: " + error.stack);
      res.status(500).send("Lỗi khi thêm thương hiệu");
      return;
    }
    res.json({ id: results.insertId, ...brand });
  });
};

const updateBrand = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const brand = { name };

  // Nếu có file ảnh mới
  if (req.file) {
    const imageUrl = req.file.path;
    brand.logo = imageUrl;
  }

  dbConn.query(
    "UPDATE brands SET ? WHERE id = ?",
    [brand, id],
    (error, results, fields) => {
      if (error) {
        console.error("Lỗi khi cập nhật thương hiệu: " + error.stack);
        res.status(500).send("Lỗi khi cập nhật thương hiệu");
        return;
      }
      res.json({ message: "Cập nhật thương hiệu thành công", brand });
    },
  );
};

const deleteBrand = (req, res) => {
  const { id } = req.params;

  dbConn.query(
    "DELETE FROM brands WHERE id = ?",
    id,
    (error, results, fields) => {
      if (error) {
        console.error("Lỗi khi xóa thương hiệu: " + error.stack);
        res.status(500).send("Lỗi khi xóa thương hiệu");
        return;
      }
      res.json({ message: "Xóa thương hiệu thành công" });
    },
  );
};

module.exports = {
  getAllBrands,
  addNewBrand,
  updateBrand,
  deleteBrand,
  upload,
};
