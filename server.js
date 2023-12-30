const { addAbortListener } = require("events");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const { Query } = require("mysql2/typings/mysql/lib/protocol/sequences/Query");
require('dotenv').config();

const password = process.env.PASSWORD;

// create mysql connection
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Zeigh1zeigh",
    database: "employeeTracker_db",
});

// connect to the database
connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to database.");
    // start application
    start();
});

// function to start sql employee tracker application
function start() {
    inquirer
    .prompt({
        type: "list",
        name: "action",
        message: "Action?",
        choices: [
            "Departments",
            "Roles",
            "Employees",
            "+ department",
            "+ role",
            "+ employee",
            "+ manager",
            "update employee",
            "employees by manager",
            "employees by department",
            "Delete Department | Roles | Employees",
            "total utilized budget of department",
            "exit",
        ],
    })
    .then((answer) => {
        switch (answer.action) {
            case "Departments":
                Departments();
                break;
            case "Roles":
                Roles();
                break;
            case "Employees":
                Employees();
                break;
            case "+ department":
                addDepartment();
                break;
            case "+ role":
                addRole();
                break;
            case "+ employee":
                addEmployee();
                break;
            case "+ manager":
                addManager();
                break;
            case "update employee":
                updateEmployee();
                break;
            case "employees by manager":
                employeesByManager();
                break;
            case "employees by department":
                employeesByDepartment;
                break;
            case "Delete Department | Roles | Employees":
                deleteDepartmentRolesEmployees();
                break;
            case "total utilized budget of department":
                totalUtilizationBudgetOfDepartment();
                break;
            case "exit":
                connection.end();
                console.log(Complete.);
                break;
    }
});
}

// function to view all departments
function Departments() {
    const query = "SELECT * FROM departments";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        // restart the application
        start();
    })
}

// function to view all roles
function Roles(){
    const query = "SELECT roles.title, roles.id, departments.department_name, roles.salary from roles join departments on roles.department_id = departments.id";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        // restart the application
        start();
    });
}

// function to view all employees
function Employees() {
    const query =`
    SELECT e.id, e.first_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, '', m.last_name) AS manager_name FROM employee e LEFT JOIN roles r ON e.role_id = r.id
    LEFT JOIN departments d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        // restart the application
        start();
    });
}

// function to add a department
function addDepartment() {
    inquirer
    .prompt({
        type: "input",
        name: "name",
        message: "Name of new department:",
    })
    .then((answer) => {
        console.log(answer.name);
        const query = `INSERT INTO departments (department_name) VALUES ("${answer.name}")`;
        connection.query(query, (err, res) => {
            if (err) throw err;
            console.log(`Added department ${answer.name} to database.`);
            // reset the application
            start();
            console.log(answer.name);
        });
    });
}
