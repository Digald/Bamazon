// Require packages
var inquirer = require("inquirer");
var mysql = require("mysql");
var WordTable = require("word-table");

// Connect to mysql
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  seeItems();
});

function seeItems() {
  connection.query("SELECT * FROM products", function(err, res) {
    // Log error
    if (err) {
      return console.log(err);
    }
    // Display table of products upon running
    var table = [];
    for (var i = 0; i < res.length; i++) {
      table.push(Object.values(res[i]));
    }
    var wt = new WordTable(Object.keys(res[0]), table);
    console.log(wt.string());
    // console.log(table);
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
        // console.log(answer);
        if (res[answer.item - 1].stock_quantity < answer.quantity) {
          console.log("Insufficient Stock! Your order has been canceled...");
        } else {
          connection.query(
            "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?",
            [answer.quantity, answer.item],
            function(err, res) {
              if (err) {
                return console.log(err);
              }
              console.log("The items have been subtracted from our inventory.");
            }
          );
          displayPrice(answer);
        }
      });
  });
}

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
  });
}