import inquirer from "inquirer";
const { prompt } = inquirer;

import dotenv from 'dotenv';
dotenv.config();
const password = process.env.PASSWORD;

// create mysql connection
import { createConnection } from "mysql2";
const connection = createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Zeigh1zeigh",
    database: "employeeTracker_db",
});

// connect to the database
connection.connect((err) => {
    if (err) {
        console.error("Error connecting to database:", err);
     process.exit(1);
    }
    console.log("Connected to database.");
    // start application
    start();
});

// function to start sql employee tracker application
function start() {
    prompt({
        type: "list",
        name: "action",
        message: "Action?",
        choices: [
            "Department",
            "Role",
            "Employee",
            "+ Department",
            "+ Role",
            "+ Employee",
            "Update employee role",
            "Exit",
        ],
    })
    .then((answer) => {
        switch (answer.action) {
            case "Department":
                department();
                break;
            case "Role":
                role();
                break;
            case "Employee":
                employee();
                break;
            case "+ Department":
                addDepartment();
                break;
            case "+ Role":
                addRole();
                break;
            case "+ Employee":
                addEmployee();
                break;
            case "+ Manager":
                addManager();
                break;
            case "Update employee role":
                updateEmployeeRole();
                break;
            case "Exit":
                connection.end();
                console.log("Complete.");
                break;
            default:
                console.log("No case matched");
    }
});
}

// function to view all department
function department() {
    console.log("Dpartment action");
    const query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        if (err) {
        console.error("Error executing query:", err);
        throw err;
        }
       console.log("Query result:", res);
        console.table(res);
        // restart the application
        start();
    });
}

// function to view all roles
function role(){
    const query = "SELECT role.title, role.id, department.department_name, role.salary from role join department on role.department_id = department.id";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        // restart the application
        start();
    });
}

// function to view all employees
function employee() {
    const query =`
    SELECT e.id, e.first_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, '', m.last_name) AS manager_name FROM employee e LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON r.department_id = d.id
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
    prompt({
        type: "input",
        name: "name",
        message: "Name of new department:",
    })
    .then((answer) => {
        console.log(answer.name);
        const query = `INSERT INTO department (department_name) VALUES ("${answer.name}")`;
        connection.query(query, (err, res) => {
            if (err) throw err;
            console.log(`Added department ${answer.name} to database.`);
            // reset the application
            start();
            console.log(answer.name);
        });
    });
}

function addRole() {
    const query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        if(err) throw err;
        prompt([
            {
                type: "input",
                name: "title",
                message: "Title of new role:",
            },
            {
                type: "input",
                name: "salary",
                message: "Salary of the new role:",
            },
            {
                type: "list",
                name: "department",
                message: "Select department:",
                choices: res.map(
                    //(department) => department.department_name
                    (department) => department.id + '. ' + department.department_name
                ),
            }
        ])
        .then((answer) => {
            // const department = res.find(
            //     (department) => department.name === answer.department
            // );
            const departmentID = answer.department.split('.')[0]
            console.log(answer);
            // console.log(answer.title, answer.salary, answer.department);
            // console.log(answer.department.split('.'));
            // console.log(departmentID);z
            const query = "INSERT INTO role SET ?";
            connection.query(
                query,
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: departmentID,
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(
                        `Added role ${answer.title} with salary ${answer.salary} to the ${answer.department} department in the database.`
                    );
// restart the application
                   start(); 
                }
            );
        });
    });
}
function addEmployee() {
    // retrieve list of roles from the database
    connection.query("SELECT id, title FROM role", (error, results) => {
        if (error) {
            console.error(error);
            return;
        }
        const role = results.map(({ id, title }) => ({
            name: title,
            value: id,
        }));
        // retrieve list of employees from the database to use as managers
        connection.query(
            'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee',
            (error, results) => {
                if (error) {
                    console.error(error);
                    return;
                }
                console.table(results)
                console.table(results.name)
                const managers = results.map(({ id, name }) => ({
                    name,
                    value: id,
                }));
                // prompt the user for employee information
                prompt ([
                    {
                        type: "input",
                        name: "firstName",
                        message: "Employee first name:",
                    },
                    {
                        type: "input",
                        name: "lastName",
                        message: "Employee last name:",
                  },
                  {
                    type: "list",
                    name: "roleId",
                    message: "Select employee role:",
                    choices: role,
                  },
                  {
                    type: "list",
                    name: "managerId",
                    message: "Select employee manager:",
                    choices: [
                        { name: "None", value: null },
                        ...managers,
                    ],
                  },
                ])
                .then((answer) => {
                    // insert the employee into the database
                    const sql =
                    "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                    const values = [
                        answer.firstName,
                        answer.lastName,
                        answer.roleId,
                        answer.managerId,
                    ];
                    connection.query(sql, values, (error) => {
                        if (error) {
                            console.error(error);
                            return;
                        }
                        console.log("Employee added successfully.");
                        start();
                    });
                })
                .catch((error) => {
                    console.error(error);
                });
            }
        );
    });
}

// function to update an employee role
function updateEmployeeRole() {
    const queryEmployee =
    "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role ON employee.role_id = role.id";
    const queryRole = "SELECT * FROM role";
    connection.query(queryEmployee, (err, resEmployee) => {
        if (err) throw err;
    connection.query(queryRole, (err, resRole) => {
        if (err) throw err;
        inquirer
        prompt([
        
            {
                type: "list",
                name: "selectEmployee",
                message: "Select employee to update:",
                choices: resEmployee.map(
                    (employee) =>
                    `${employee.first_name} ${employee.last_name}`
                ),
            },
            {
                type: "list",
                name: "role",
                message: "Select new role:",
                choices: resRole.map((role) => role.title),
            },
        ])
        .then((answers) => {
            const selectedEmployee = resEmployee.find(
                (employee) =>
                `${employee.first_name} ${employee.last_name}` === answers.selectedEmployee
          );
            const role = resRole.find(
                (role) => role.title === answers.role
            );
            const query =
            "UPDATE employee SET role_id = ? WHERE id = ?";
            connection.query(
                query,
                [role.id, employee.id],
                (err, res) => {
                    if (err) throw err;
                    console.log(
                        `Updated ${employee.first_name} ${employee.last_name}'s role to ${role.title} in the database.`
                    );
                    // restart the application
                    start();
                }
            );
        });
    });
});
}

// close the connection when the application exits
process.on("exit", () => {
    connection.end();
});