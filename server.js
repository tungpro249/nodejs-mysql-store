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
app.use("", require("./routers/user"));

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}...`);
});
