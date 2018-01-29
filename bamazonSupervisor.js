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
  productSales();
});

function productSales() {
  connection.query(
    "SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales FROM products left JOIN departments ON products.department_name = departments.department_name GROUP BY department_name",
    function(err, res) {
        if (err){
            return console.log(err);
        }
        var table = [];
        for (var i = 0; i < res.length; i++){
            table.push(Object.values(res[i]));
        }
        var tableHeading = Object.keys(res[0]);
        tableHeading.push('total_profit');
        
        var wt = new WordTable(tableHeading, table);
        console.log(wt.string());
    }
  );
}
function displaySales() {
  connection.query("SELECT * FROM departments", function(err, res) {
    console.log(res);
  });
}
