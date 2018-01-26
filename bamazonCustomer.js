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
    // Inquirer prompt asking what product they would like to buy
  });
}
