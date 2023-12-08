const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "tungpro249",
    database: "doantotnghiep",
});

const createTable = (con) => {
    // create user
    const createUsersTableQuery = `CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      pass_word VARCHAR(255),
      email VARCHAR(255),
      first_name VARCHAR(255),
      last_name VARCHAR(255),
      address VARCHAR(255),
      phone VARCHAR(20),
      generate_code VARCHAR(255),
      role INT DEFAULT 0
    )`
    con.query(createUsersTableQuery, (err, result) => {
        if(err) throw err;
        if(result.warningCount === 0) {
            console.log("Table users created");
        } else {
            console.log("Table users already exists");
        }
    })

    // create categories
    const createCategoriesTableQuery = `CREATE TABLE IF NOT EXISTS categories (
     id INT PRIMARY KEY AUTO_INCREMENT,
     name VARCHAR(255)
    )`
    con.query(createCategoriesTableQuery, (err, result) => {
        if(err) throw err;
        if(result.warningCount === 0) {
            console.log("Table categories created");
        } else {
            console.log("Table categories already exists");
        }
    })

    // create product
    const createProductsTableQuery = `CREATE TABLE IF NOT EXISTS products (
     id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255),
      description TEXT,
      image VARCHAR(255),
      price DECIMAL(10, 2),
      quantity INT,
      category_id INT,
      isNew BOOLEAN,
      created_at DATE,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )`
    con.query(createProductsTableQuery, (err, result) => {
        if(err) throw err;
        if(result.warningCount === 0) {
            console.log("Table products created");
        } else {
            console.log("Table products already exists");
        }
    })

    // create orders
    const createOrdersTableQuery = `CREATE TABLE IF NOT EXISTS orders (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT,
      date_created DATE,
      status VARCHAR(255),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`
    con.query(createOrdersTableQuery, (err, result) => {
        if(err) throw err;
        if(result.warningCount === 0) {
            console.log("Table orders created");
        } else {
            console.log("Table orders already exists");
        }
    })

    // create order_items
    const createOrderItemsTableQuery = `CREATE TABLE IF NOT EXISTS order_items (
      id INT PRIMARY KEY AUTO_INCREMENT,
      order_id INT,
      product_id INT,
      quantity INT,
      price DECIMAL(10, 2),
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )`
    con.query(createOrderItemsTableQuery, (err, result) => {
        if(err) throw err;
        if(result.warningCount === 0) {
            console.log("Table order_items created");
        } else {
            console.log("Table order_items already exists");
        }
    })

    // create carts
    const createCartsTableQuery = `CREATE TABLE IF NOT EXISTS carts (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`
    con.query(createCartsTableQuery, (err, result) => {
        if(err) throw err;
        if(result.warningCount === 0) {
            console.log("Table carts created");
        } else {
            console.log("Table carts already exists");
        }
    })

    // create carts
    const createCartItemsTableQuery = `CREATE TABLE IF NOT EXISTS cart_items (
      id INT PRIMARY KEY AUTO_INCREMENT,
      cart_id INT,
      product_id INT,
      quantity INT,
      FOREIGN KEY (cart_id) REFERENCES carts(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )`
    con.query(createCartItemsTableQuery, (err, result) => {
        if(err) throw err;
        if(result.warningCount === 0) {
            console.log("Table cart_items created");
        } else {
            console.log("Table cart_items already exists");
        }
    })
    // create loyal_customers
    const createLoyalCustomersTableQuery = `CREATE TABLE IF NOT EXISTS loyal_customers  (
      id INT PRIMARY KEY AUTO_INCREMENT,
      email VARCHAR(255),
      first_name VARCHAR(255),
      last_name VARCHAR(255),
      date_registered DATE
    )`
    con.query(createLoyalCustomersTableQuery, (err, result) => {
        if(err) throw err;
        if(result.warningCount === 0) {
            console.log("Table loyal_customers created");
        } else {
            console.log("Table loyal_customers already exists");
        }
    })
}

connection.connect(function (error) {
    if (!!error) {
        console.log(error);
    } else {
        console.log("Database Connected Successfully..!!");
        createTable(connection)
    }
});

module.exports = connection;
