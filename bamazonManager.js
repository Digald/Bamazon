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
        lowInventory();
        break;
      case "Add to Inventory":
        addInventory();
        break;
      case "Add New Product":
        addProduct();
        break;
    }
  });
}
//-----------------------------------------------------Query Functions
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
  connection.query(
    "SELECT id, product_name, stock_quantity FROM products WHERE stock_quantity < 5",
    function(err, res) {
      // console.log(res);
      var table = [];
      for (var i = 0; i < res.length; i++) {
        table.push(Object.values(res[i]));
      }
      var wt = new WordTable(Object.keys(res[0]), table);
      console.log("The following items are low on inventory:");
      console.log(wt.string());
    }
  );
}

function addInventory() {
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
    inquirer
      .prompt([
        {
          type: "input",
          name: "item",
          message: "Which product id would you like to re-stock?",
          validate: function(val) {
            return val > 0 && val <= table.length;
          }
        },
        {
          type: "input",
          name: "amount",
          message: "How much would you like to add to the current stock?",
          validate: function(val) {
            return val !== "" && val > 0;
          }
        }
      ])
      .then(function(answer) {
        console.log(answer);
        connection.query(
          "UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?",
          [answer.amount, answer.item],
          function(err, res) {
            if (err) {
              return console.log(err);
            }
            console.log("Product stock successfully updated!");
          }
        );
      });
  });
}

function addProduct() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "product",
        message: "Enter the name of the product you would like to add..."
      },
      {
        type: "list",
        name: "department",
        message: "Choose the department the product belongs to...",
        choices: ["Arts and Crafts", "Clothes", "Electronics", "Toys"]
      },
      {
        type: "input",
        name: "price",
        message: "Enter the price the product should cost...",
        validate: function(val) {
          return val >= 0;
        }
      },
      {
        type: "input",
        name: "stock",
        message: "Enter the quantity of the product you want to add...",
        validate: function(val) {
          return val >= 0;
        }
      }
    ])
    .then(function(answer) {
      console.log(answer);
      connection.query(
        "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)",
        [answer.product, answer.department, answer.price, answer.stock],
        function(err, res) {
          console.log("Your product has been added to the database!");
        }
      );
    });
}
