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
  viewOptions();
});
var menu = {
  type: "list",
  name: "menu",
  message: "Choose an option:",
  choices: [
    "View Products for Sale",
    "View Low Inventory",
    "Add to Inventory",
    "Add New Product"
  ]
};

function viewOptions() {
  inquirer.prompt(menu).then(function(answer) {
    // console.log(answer);
    switch (answer.menu) {
      case "View Products for Sale":
        viewProducts();
        break;
      case "View Low Inventory":
        lowInventory()
        break;
    }
  });
}

function viewProducts() {
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
  });
}

function lowInventory() {
    connection.query('SELECT id, product_name, stock_quantity FROM products WHERE stock_quantity < 5', function(err, res){
        // console.log(res);
        var table = [];
        for (var i = 0; i < res.length; i++){
            table.push(Object.values(res[i]));
        }
        var wt = new WordTable(Object.keys(res[0]), table);
        console.log('The following items are low on inventory:');
        console.log(wt.string());
    });
}
