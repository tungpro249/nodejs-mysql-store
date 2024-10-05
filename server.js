const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const cors = require("cors");

const app = express();

// HTTP request
app.use(morgan("combined"));

app.use(cors());

// Enable parsing of JSON payloads
app.use(express.json());

// routers
app.use("/api/comments", require("./routers/comment"));
app.use("/api/auth", require("./routers/user"));
app.use("/api/categories", require("./routers/categories"));
app.use("/api/products", require("./routers/products"));
app.use("/api/carts", require("./routers/cart"));
app.use("/api/orders", require("./routers/order"));
app.use("/api/loyal", require("./routers/loyalCustomer"));
app.use("/api/brands", require("./routers/brands"));
app.use("/api", require("./routers/home"));

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server started on port ${process.env.PORT}...`);
});
