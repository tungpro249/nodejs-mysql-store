const dbConn = require("../config");
const multer = require("multer");

// Định nghĩa cấu hình cho multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Thư mục lưu trữ hình ảnh
  },
  filename: function (req, file, cb) {
    // Tạo tên file mới bằng cách kết hợp timestamp và tên file gốc
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + fileExtension);
  },
});

// Khởi tạo middleware multer với cấu hình
const upload = multer({ storage: storage });

const getAllProducts = (req, res) => {
  const { search, category } = req.query;
  let query = `SELECT p.id, p.name, p.description, p.image, p.quantity, p.price, c.id as category_id, c.name as category_name
               FROM products p
               JOIN categories c ON p.category_id = c.id`;

  const queryParams = [];

  if (search) {
    query += " WHERE LOWER(p.name) LIKE ?";
    queryParams.push(`%${search.toLowerCase()}%`);
  }

  if (category) {
    if (queryParams.length > 0) {
      query += " AND c.id = ?";
    } else {
      query += " WHERE c.id = ?";
    }
    queryParams.push(category);
  }

  dbConn.query(query, queryParams, (error, results, fields) => {
    if (error) {
      console.error("Lỗi khi lấy dữ liệu sản phẩm: " + error.stack);
      res.status(500).send("Lỗi khi lấy dữ liệu sản phẩm.");
      return;
    }

    // Transform the results to the desired format
    const transformedResults = results.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.image,
      quantity: product.quantity,
      price: product.price,
      category: { id: product.category_id, name: product.category_name },
    }));

    // Trả về danh sách sản phẩm đã được tìm kiếm và lọc
    res.json(transformedResults);
  });
};

const getProductDetails = (req, res) => {
  const productId = req.params.id;
  const query = `SELECT p.id, p.name, p.description, p.image, p.quantity, p.price, c.id as category_id, c.name as category_name
                   FROM products p
                   JOIN categories c ON p.category_id = c.id
                   WHERE p.id = ?`;

  dbConn.query(query, [productId], (error, results) => {
    if (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      return res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    const product = results[0];
    const transformedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.image,
      quantity: product.quantity,
      price: product.price,
      category: { id: product.category_id, name: product.category_name },
    };

    res.json(transformedProduct);
  });
};

const addNewProduct = (req, res) => {
  const { name, description, price, quantity, category_id } = req.body;
  const product = { name, description, price, quantity, category_id };
  const created_at = new Date();

  product.created_at = created_at;
  // Lưu trữ đường dẫn hình ảnh vào biến imageUrl
  const imageUrl = req.file ? req.file.path : null;
  product.image = imageUrl;

  dbConn.query(
    "INSERT INTO products SET ?",
    product,
    (error, results, fields) => {
      if (error) {
        console.error("Lỗi khi thêm sản phẩm mới: " + error.stack);
        res.status(500).send("Lỗi khi thêm sản phẩm mới.");
        return;
      }
      console.log("Thêm sản phẩm mới thành công.");

      // Thêm đường dẫn hình ảnh vào cơ sở dữ liệu
      const productId = results.insertId;
      dbConn.query(
        "UPDATE products SET image = ? WHERE id = ?",
        [imageUrl, productId],
        (error, results, fields) => {
          if (error) {
            console.error(
              "Lỗi khi cập nhật đường dẫn hình ảnh: " + error.stack,
            );
            res.status(500).send("Lỗi khi cập nhật đường dẫn hình ảnh.");
            return;
          }

          // Trả về thông tin sản phẩm mới vừa thêm
          res.status(200).json({
            message: "Thêm sản phẩm mới thành công.",
            data: { id: productId, ...product, image: imageUrl },
          });
        },
      );
    },
  );
};

const updateProduct = (req, res) => {
  const id = req.params.id;
  const { name, description, price, quantity, category_id } = req.body;
  const product = { name, description, price, quantity, category_id };
  const created_at = new Date(); // Lấy thời gian hiện tại

  product.created_at = created_at;
  // Lưu trữ đường dẫn hình ảnh vào biến imageUrl
  const imageUrl = req.file ? req.file.path : null;

  if (imageUrl === null) {
    // Trường hợp không có hình ảnh mới, giữ nguyên đường dẫn hình ảnh cũ
    dbConn.query(
      "SELECT image FROM products WHERE id = ?",
      [id],
      (error, results, fields) => {
        if (error) {
          console.error("Lỗi khi truy vấn cơ sở dữ liệu: " + error.stack);
          res.status(500).send("Lỗi khi cập nhật sản phẩm.");
          return;
        }

        // Lấy đường dẫn hình ảnh cũ từ kết quả truy vấn
        const oldImageUrl = results[0].image;

        // Gán đường dẫn hình ảnh cũ vào product
        product.image = oldImageUrl;

        // Tiến hành cập nhật thông tin sản phẩm
        performProductUpdate(id, product, res);
      },
    );
  } else {
    // Trường hợp có hình ảnh mới, cập nhật đường dẫn hình ảnh mới
    product.image = imageUrl;

    // Tiến hành cập nhật thông tin sản phẩm
    performProductUpdate(id, product, res);
  }
};

// Hàm thực hiện cập nhật thông tin sản phẩm
const performProductUpdate = (id, product, res) => {
  dbConn.query(
    "UPDATE products SET ? WHERE id = ?",
    [product, id],
    (error, results, fields) => {
      if (error) {
        console.error("Lỗi khi cập nhật sản phẩm: " + error.stack);
        res.status(500).send("Lỗi khi cập nhật sản phẩm.");
        return;
      }

      console.log("Cập nhật sản phẩm thành công.");

      // Trả về thông tin sản phẩm đã được cập nhật
      res.status(200).json({
        message: "Cập nhật sản phẩm thành công.",
        data: { id, ...product, image: product.image },
      });
    },
  );
};

const deleteProduct = (req, res) => {
  const id = req.params.id;

  dbConn.query(
    "DELETE FROM products WHERE id = ?",
    id,
    (error, results, fields) => {
      if (error) {
        console.error("Lỗi khi xóa sản phẩm: " + error.stack);
        res.status(500).send("Lỗi khi xóa sản phẩm.");
        return;
      }
      console.log("Xóa sản phẩm thành công.");
      res.status(200).json({ message: "Xóa sản phẩm thành công." });
    },
  );
};

module.exports = {
  getAllProducts,
  getProductDetails,
  addNewProduct,
  updateProduct,
  deleteProduct,
  upload,
};
