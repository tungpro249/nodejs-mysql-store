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
app.use("/api/auth", require("./routers/user"));
app.use("/api/categories", require("./routers/categories"));
app.use("/api/products", require("./routers/products"));
app.use("/api/carts", require("./routers/cart"))

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}...`);
});
