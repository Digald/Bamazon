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
  inquirer
    .prompt({
      type: "list",
      name: "options",
      message: "What would you like to do?",
      choices: ["View product sales by department", "Create new department"]
    })
    .then(function(answer) {
      // console.log(answer);
      switch (answer.options) {
        case "View product sales by department":
          productSales();
          break;
        case "Create new department":
          createDepartment();
          break;
      }
    });
});

function productSales() {
  connection.query(
    "SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales FROM products left JOIN departments ON products.department_name = departments.department_name GROUP BY department_name",
    function(err, res) {
      if (err) {
        return console.log(err);
      }
      var table = [];

      // add the total_profit header to the table
      var tableHeading = Object.keys(res[0]);
      tableHeading.push("total_profit");

      for (var i = 0; i < res.length; i++) {
        var data = Object.values(res[i]);
        var total_profit = Object.values(res[i])[3] - Object.values(res[i])[2];
        data.push(total_profit.toFixed(2));
        table.push(data);
      }
      // display table
      var wt = new WordTable(tableHeading, table);
      console.log(wt.string());
    }
  );
}

function createDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "Type the department you want to add..."
      },
      {
        type: "input",
        name: "overhead",
        message: "Type in the overhead costs..."
      }
    ])
    .then(function(answer) {
      // console.log(answer);
      connection.query(
        "INSERT INTO departments (department_name, over_head_costs) VALUES (?,?)",
        [answer.department, answer.overhead],
        function(err, res) {
          console.log("Department has been added!");
        }
      );
    });
}
