const dbConn = require("../config");
const createOrder = (req, res) => {
  try {
    const { user_id, items } = req.body;

    const orderQuery =
      "INSERT INTO orders (user_id, date_created, status) VALUES (?, ?, ?)";
    const orderValues = [user_id, new Date(), "Đang xử lý"];

    dbConn.query(orderQuery, orderValues, (error, result) => {
      if (error) {
        console.error("Lỗi khi tạo đơn hàng:", error);
        return res
          .status(500)
          .json({ error: "Đã xảy ra lỗi khi tạo đơn hàng." });
      }

      const orderId = result.insertId;

      const orderItemsQuery =
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)";

      items.forEach((item) => {
        const { product_id, quantity, price } = item;
        const orderItemsValues = [orderId, product_id, quantity, price];

        dbConn.query(orderItemsQuery, orderItemsValues, (error) => {
          if (error) {
            console.error("Lỗi khi tạo mặt hàng trong đơn hàng:", error);
            return res.status(500).json({
              error: "Đã xảy ra lỗi khi tạo mặt hàng trong đơn hàng.",
            });
          }

          // Trừ số lượng trong kho sau khi thêm thành công đơn hàng
          const updateProductQuantityQuery =
            "UPDATE products SET quantity = quantity - ? WHERE id = ?";
          dbConn.query(
            updateProductQuantityQuery,
            [quantity, product_id],
            (error) => {
              if (error) {
                console.error(
                  "Lỗi khi cập nhật số lượng sản phẩm trong kho:",
                  error,
                );
                return res.status(500).json({
                  error:
                    "Đã xảy ra lỗi khi cập nhật số lượng sản phẩm trong kho.",
                });
              }
            },
          );
        });
      });

      // Xóa giỏ hàng sau khi đơn hàng được tạo thành công
      const deleteCartItemsQuery =
        "DELETE FROM cart_items WHERE cart_id IN (SELECT id FROM carts WHERE user_id = ?)";
      dbConn.query(deleteCartItemsQuery, [user_id], (error) => {
        if (error) {
          console.error("Lỗi khi xóa mặt hàng trong giỏ hàng:", error);
          return res
            .status(500)
            .json({ error: "Đã xảy ra lỗi khi xóa mặt hàng trong giỏ hàng." });
        }

        // Sau khi xóa các mặt hàng giỏ hàng liên quan, bạn có thể tiến hành xóa giỏ hàng
        const deleteCartQuery = "DELETE FROM carts WHERE user_id = ?";
        dbConn.query(deleteCartQuery, [user_id], (error) => {
          if (error) {
            console.error("Lỗi khi xóa giỏ hàng:", error);
            return res
              .status(500)
              .json({ error: "Đã xảy ra lỗi khi xóa giỏ hàng." });
          }

          res.status(201).json({ message: "Đơn hàng đã được tạo thành công." });
        });
      });
    });
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi tạo đơn hàng." });
  }
};

const getOrder = (req, res) => {
  try {
    const orderId = req.params.id;

    const orderQuery = "SELECT * FROM orders WHERE id = ?";
    dbConn.query(orderQuery, orderId, (error, order) => {
      if (error) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", error);
        return res
          .status(500)
          .json({ error: "Đã xảy ra lỗi khi lấy thông tin đơn hàng." });
      }

      if (order.length === 0) {
        return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
      }

      const orderItemsQuery = "SELECT * FROM order_items WHERE order_id = ?";
      dbConn.query(orderItemsQuery, orderId, (error, orderItems) => {
        if (error) {
          console.error(
            "Lỗi khi lấy thông tin mặt hàng trong đơn hàng:",
            error,
          );
          return res.status(500).json({
            error: "Đã xảy ra lỗi khi lấy thông tin mặt hàng trong đơn hàng.",
          });
        }

        res.status(200).json({ order: order[0], orderItems });
      });
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin đơn hàng:", error);
    res
      .status(500)
      .json({ error: "Đã xảy ra lỗi khi lấy thông tin đơn hàng." });
  }
};

const getOrderDetails = (req, res) => {
  try {
    const userId = req.params.id;

    const query = `
            SELECT users.first_name, users.last_name, users.email, users.phone, products.name AS product_name, order_items.quantity, order_items.price, orders.id, orders.status, orders.date_created
            FROM orders
            JOIN users ON orders.user_id = users.id
            JOIN order_items ON orders.id = order_items.order_id
            JOIN products ON order_items.product_id = products.id
            WHERE users.id = ?
        `;
    dbConn.query(query, userId, (error, results) => {
      if (error) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", error);
        return res
          .status(500)
          .json({ error: "Đã xảy ra lỗi khi lấy thông tin đơn hàng." });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
      }

      const orderDetails = results.map((result) => {
        const formattedDate = new Date(result.date_created).toLocaleString(
          "vi-VN",
          { timeZone: "Asia/Ho_Chi_Minh" },
        );

        return {
          order_id: result.id,
          user_name: `${result.first_name} ${result.last_name}`,
          email: result.email,
          phone_number: result.phone,
          product_name: result.product_name,
          quantity: result.quantity,
          price: result.price,
          status: result.status,
          date_created: formattedDate,
        };
      });

      res.status(200).json({ orderDetails });
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin đơn hàng:", error);
    res
      .status(500)
      .json({ error: "Đã xảy ra lỗi khi lấy thông tin đơn hàng." });
  }
};

const getAllOrders = (req, res) => {
  try {
    const query = `
            SELECT orders.*, CONCAT(users.last_name, ' ', users.first_name) AS user_name, order_items.quantity, order_items.price, products.name AS product_name
            FROM orders
            JOIN users ON orders.user_id = users.id
            JOIN order_items ON orders.id = order_items.order_id
            JOIN products ON order_items.product_id = products.id
        `;
    dbConn.query(query, (error, results) => {
      if (error) {
        console.error("Lỗi khi lấy thông tin tất cả đơn hàng:", error);
        return res
          .status(500)
          .json({ error: "Đã xảy ra lỗi khi lấy thông tin tất cả đơn hàng." });
      }

      const orders = results.map((result) => {
        return {
          id: result.id,
          user_id: result.user_id,
          user_name: result.user_name,
          quantity: result.quantity,
          price: result.price,
          date_created: result.date_created,
          status: result.status,
          product_name: result.product_name,
        };
      });

      res.status(200).json({ orders });
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin tất cả đơn hàng:", error);
    res
      .status(500)
      .json({ error: "Đã xảy ra lỗi khi lấy thông tin tất cả đơn hàng." });
  }
};

const updateOrder = (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const updateQuery = "UPDATE orders SET status = ? WHERE id = ?";
    const updateValues = [status, orderId];

    dbConn.query(updateQuery, updateValues, (error, result) => {
      if (error) {
        console.error("Lỗi khi cập nhật đơn hàng:", error);
        return res
          .status(500)
          .json({ error: "Đã xảy ra lỗi khi cập nhật đơn hàng." });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
      }

      res
        .status(200)
        .json({ message: "Đơn hàng đã được cập nhật thành công." });
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật đơn hàng:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi cập nhật đơn hàng." });
  }
};

const deleteOrder = (req, res) => {
  try {
    const orderId = req.params.id;

    const updateQuery = "UPDATE orders SET status = ? WHERE id = ?";
    const updateValues = ["Hủy đơn hàng", orderId];

    dbConn.query(updateQuery, updateValues, (error, result) => {
      if (error) {
        console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
        return res
          .status(500)
          .json({ error: "Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng." });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
      }

      res.status(200).json({
        message: 'Trạng thái đơn hàng đã được cập nhật thành "Hủy đơn hàng".',
      });
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    res
      .status(500)
      .json({ error: "Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng." });
  }
};

const fuck = (req, res) => {
  const userData = req.body.userData; // Thông tin người dùng không có tài khoản
  const items = req.body.items; // Danh sách các mặt hàng trong đơn hàng

  // Tạo người dùng tạm thời
  const createTempUserQuery =
    "INSERT INTO users (email, first_name, last_name, pass_word) VALUES (?, ?, ?, ?)";
  const tempEmail = userData.email;
  const tempFirstName = userData.first_name;
  const tempLastName = userData.last_name;
  const tempPassword = "1"; // Giá trị mặc định cho trường pass_word
  const userValues = [tempEmail, tempFirstName, tempLastName, tempPassword];

  dbConn.query(createTempUserQuery, userValues, (error, userResult) => {
    if (error) {
      console.error("Lỗi khi tạo người dùng tạm thời:", error);
      res.status(500).json({ error: "Lỗi khi tạo người dùng tạm thời" });
      return;
    }

    const tempUserId = userResult.insertId;

    // Tạo đơn hàng
    const createOrderQuery =
      "INSERT INTO orders (user_id, date_created, status) VALUES (?, NOW(), ?)";
    const orderValues = [tempUserId, "Đang xử lý"];

    dbConn.query(createOrderQuery, orderValues, (error, orderResult) => {
      if (error) {
        console.error("Lỗi khi tạo đơn hàng:", error);
        res.status(500).json({ error: "Lỗi khi tạo đơn hàng" });
        return;
      }

      const orderId = orderResult.insertId;

      // Tạo các mặt hàng trong đơn hàng
      const createOrderItemsQuery =
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?";
      const orderItemsValues = items.map((item) => [
        orderId,
        item.product_id,
        item.quantity,
        item.price,
      ]);

      dbConn.query(
        createOrderItemsQuery,
        [orderItemsValues],
        (error, orderItemsResult) => {
          if (error) {
            console.error("Lỗi khi tạo các mặt hàng trong đơn hàng:", error);
            res
              .status(500)
              .json({ error: "Lỗi khi tạo các mặt hàng trong đơn hàng" });
            return;
          }

          res.status(200).json({ orderId: orderId });
        },
      );
    });
  });
};

module.exports = {
  createOrder,
  getOrder,
  updateOrder,
  deleteOrder,
  getAllOrders,
  getOrderDetails,
  fuck,
};
