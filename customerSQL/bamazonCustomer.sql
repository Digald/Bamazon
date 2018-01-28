DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
    id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100),
    department_name VARCHAR(100),
    price FLOAT(10,2),
    stock_quantity INT(10),
    product_sales FLOAT(10,2),
    PRIMARY KEY (id)
);

