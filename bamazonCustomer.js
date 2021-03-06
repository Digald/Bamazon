// Require packages
var inquirer = require("inquirer");
var mysql = require("mysql");
var WordTable = require("word-table");

// Credentials to my DB
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "bamazon"
});
// Connection created and ran here
connection.connect(function(err) {
  if (err) throw err;
  seeItems();
});

// function to see products displayed on a table in the console
function seeItems() {
  connection.query(
    "SELECT id, product_name, department_name, price, stock_quantity FROM products",
    function(err, res) {
      // Log error
      if (err) {
        return console.log(err);
      }
      // Display table of products upon running
      var table = [];
      for (var i = 0; i < res.length; i++) {
        table.push(Object.values(res[i]));
      }
      // word table package use
      var wt = new WordTable(Object.keys(res[0]), table);
      console.log(wt.string());

      // Inquirer prompt asking what product they would like to buy
      inquirer
        .prompt([
          {
            type: "input",
            name: "item",
            message:
              "Type in the id of the item you want to buy from the list above...",
            validate: function(val) {
              return val > 0 && val <= table.length;
            }
          },
          {
            type: "input",
            name: "quantity",
            message: "Type in a valid quantity for the item you want to buy...",
            validate: function(val) {
              return val !== "" && val > 0;
            }
          }
        ])
        .then(function(answer) {
          // take answers to first check if there is enough stock to complete the transaction
          if (res[answer.item - 1].stock_quantity < answer.quantity) {
            console.log("Insufficient Stock! Your order has been canceled...");
          } else {
            // if there is enough stock subtract user input from the product table stock
            connection.query(
              "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?",
              [answer.quantity, answer.item],
              function(err, res) {
                if (err) {
                  return console.log(err);
                }
                console.log(
                  "The items have been subtracted from our inventory."
                );
              }
            );
            displayPrice(answer);
          }
        });
    }
  );
}
// calculates the total price of the products and shows it to the user, also updates the product table 
function displayPrice(answer) {
  connection.query("SELECT price FROM products", function(err, res) {
    if (err) {
      return console.log(err);
    }
    var totalCost = res[answer.item - 1].price * answer.quantity;
    console.log(
      "Your total is $" +
        totalCost.toFixed(2) +
        "! Thank you for your purchase."
    );
    updateSales(totalCost, answer);
  });
}
// adds sales to products table required by the bamazonSupervisor.js script
function updateSales(totalCost, answer) {
  // console.log(totalCost);
  // console.log(answer);
  connection.query(
    "UPDATE products SET product_sales = product_sales + ? WHERE id = ?", [totalCost, answer.item]
  );
}
