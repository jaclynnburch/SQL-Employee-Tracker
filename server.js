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

function addRole() {
    const query = "SELECT * FROM departments";
    connection.query(query, (err, res) => {
        if(err) throw err;
        inquirer
        .prompt([
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
                    (department) => department.department_name
                ),
            }
        ])
        .then((answer) => {
            const department = res.find(
                (department) => department.name === answer.department
            );
            const query = "INSERT INTO roles SET ?";
            connection.query(
                query,
                {
                    title: answers.title,
                    salary: answers.salary,
                    department_id: department,
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(
                        `Added role ${answers.title} with salary ${answers.salary} to the ${answers.department} department in the database.`
                    );
// restart the application
                   start(), 
                }
            );
        });
    });
}
function addEmployee() {
    // retrieve list of roles from the database
    connection.query("SELECT id, title FROM roles", (error, results) => {
        if (error) {
            console.error(error);
            return;
        }
        const roles = results.map(({ id, title }) => ({
            name: title,
            value: id,
        }));
        // retrieve list of employees from the database to use as managers
        connection.query(
            'SELECT id, CONCAT(first_name, " ", last_name FROM employee',
            (error, results) => {
                if (error) {
                    console.error(error);
                    return;
                }
                const managers = results.map(({ id, name }) => ({
                    name,
                    value: id,
                }));
                // promopt the user for employee information
                inquirer
                .prompt ([
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
                    choices: roles,
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
                .then((answers) => {
                    // insert the employee into the database
                    const sql =
                    "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                    const values = [
                        answers.firstName,
                        answers.lastName,
                        answers.roleId,
                        answers.managerId,
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
// function to add a manager
function addManager() {
    const queryDepartments = "SELECT * FROM departments";
    const queryEmployee = "SELECT * FROM employee";

    connection.query(queryDepartments, (err, resDepartments) => {
        if (err) throw err;
        connection.query(queryEmployees, (err, resEmployee) => {
            if (err) throw err;
            inquirer
            .prompt([
                {
                    type: "list",
                    name: "department",
                    message: "Select department:",
                    choices: resDepartments.map(
                        (department) => department.departments_name
                    ),
                },
                {
                    type: "list",
                    name: "employee",
                    message: "Select employee to add to a manager:",
                    choices: resEmployee.map(
                        (employee) =>
                        `${employee.first_name} ${employee.last_name}`
                    ),
                },
            ])

            .then((answers) => {
                const department = resDepartments.find(
                    (departments) =>
                    department.department_name === answers.department
                );
                const employee = resEmployees.find(
                    (employee) =>
                    `${employee.first_name} ${employee.last_name}` === answers.employee
                );
                const manager = resEmployees.find(
                    (employee) =>
                    `${employee.first_name} ${employee.last_name}` === answers.manager
                );
                    const query =
                    "UPDATE employee SET manager_id = ? WHERE id = ? AND role_id IN (SELECT id FROM roles WHERE department_id = ?)";
                    connection.query(
                        query,
                        [manager.id, employee.id, department.id],
                        (err, res) => {
                            if (err) throw err;
                            console.log(
                                `Added manager ${manager.first_name} ${manager.last_name} to employee ${employee.first_name} ${employee.last_name} in department ${department.department_name}.`
                            );
                            // restart the application
                            start();
                        }
                    );
            });
        });
    });
}
// function to update an employee role
function updateEmployeeRole() {
    const queryEmployees =
    "SELECT employee.id, employee.first_name, employee.last_name, roles.title, FROM employee LEFT JOIN roles ON employee.role_id = roles.id";
    const queryRoles = "SELECT * FROM roles";
    connection.query(queryEmployees, (err, resRoles) => {
        if (err) throw err;
        inquirer
        .prompt([
            {
                type: "list",
                name: "employee",
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
                choices: resRoles.map((role) => role.title),
            },
        ])
        .then((answer) => {
            const employee = resEmployee.find(
                (employee) =>
                `${employee.first_name} ${employee.last_name}` === answers.employee
            );
            const role = resRoles.find(
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
    }
// function to view employee by manager
function viewEmployeeByManager() {
    const query = `
    SELECT
    e.id,
    e.first_name,
    e.last_name,
    r.title,
    d.department_name,
    CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    FROM
    employee e
    INNER JOIN roles r ON e.role_id = r.id
    INNER JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id
    ORDER BY
    manager_name,
    e.last_name,
    e.first_name`;

    connection.query(query, (err, res) => {
        if (err) throw err;
        
        // group employee by manager
        const employeesByManager = res.reduce((acc, cur) => {
            const managerName = cur.manager_name;
            if(acc[managerName]) {
                acc[managerName].push(cur);
            } else {
                acc[managerName] = [cur];
            }
            return acc;
        },
        {});

        // display employee by manager
        console.log("Employees by manager:");
        for (const managerName in employeesByManager) {
            console.log(`\n${managerName}:`);
            const employees = employeesByManager[managerName];
            employees.forEach((employee) => {
                console.log(
                    ` ${employee.first_name} ${employee.last_name} | ${employee.title} | ${employee.department_name}`
                );
            });
        }
        // restart the application
        start();
    });
}

// function to view employees by department
function viewEmployeesByDepartment() {
    const query =
    "SELECT department.department_name, employee.fist_name, employee.last_name FROM employee INNER JOIN roles ON employee.role_id = roles.id INNER JOIN department ON roles.department_id = departments.id ORDER BY department.department_name ASC";

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("\nEmployees by department:");
        console.table(res);
        //restart the application
        start();
    });
}
// function to delete department roles employees
function deleteDepartmentRolesEmployees() {
    inquirer
    .prompt({
        type: "list",
        name: "data",
        message: "What are you deleting?",
        choices: ["Employee", "Role", "Department"],
    })
    .then((answer) => {
        switch (answer.data) {
            case "Employee":
                deleteEmployee();
                break;
            case "Role":
                deleteRole();
                break;
            case "Department":
                deleteDepartment();
                break;
    });
}

// function to delete employees
function deleteEmployee() {
    const query = "SELECT * FROM employee";
    connection.query(query, (err, res) => {
        if (err) throw err;
        const employeeList = res.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`, value: employee.id,
        }));
        employeeList.push({ name: "Go Back", value: "back" });
        // add a "back" option
        inquirer
        .prompt({
            type: "list",
            name: "id",
            message: "Select the employee to delete:",
            choices: employeeList,
        })
        .then((answer) => {
            if (answer.id === "back") {
                // check if user selected "back"
                deleteDepartmentRolesEmployees();
                return;
            }
            const query = "DELETE FROM employee WHERE id = ?";
            connection.query(query, [answer.id], (err, res) => {
                if (err) throw err;
                console.log(
                    `Deleted employee with ID ${answer.id} from the database.`
                );
                // restart the application
                start();
            });
        });
    });
}
// function to delete role
function deleteRole() {
    // retrieve all available roles from the database
    const query = "SELECT * FROM roles";
    connection.query(query, (err, res) => {
        if (err) throw err;
        // map through the retrieved roles to create an array of choices
        const choices = res.map((role) => ({
            name: `${role.title} (${role.id}) - ${role.salary}`,
            value: role.id,
        }));
        // add a "Go Back" option to the list of choices
        choices.push({ name: "Go Back", value: null});
        inquirer
        .prompt({
            type: "list",
            name: "roleID",
            message: "Select role to be deleted:",
            choices: choices,
        })
        .then((answer) => {
            // check if the user chose the "Go Back" option
            if (answer.roleId === null) {
                // go back to the deleteDepartmentRolesEmployee function
                deleteDepartmentRolesEmployees();
                return;
            }
            const query = "DELETE FROM roles WHERE id = ?";
            connection.query(query, [answer.roleId], (err, res) => {
                if (err) throw err;
                console.log(
                    `Deleted role with ID ${answer.roleId} from the database.`
                );
                start();
            });
        });
    });
}
// function to view total utilized budget of department
function viewTotalUtilizedBudgetOfDepartment() {
    const query = "SELECT * FROM departments";
    connection.query(query, (err, res) => {
        if (err) throw err;
        const departmentChoices = res.map((department) => ({
            name: department.department_name,
            value: department_id,
        }));

        // prompt the user to select a department
        inquirer
        .prompt({
            type: "list",
            name: "departmentID",
            message: "Select department to calculate total salary?",
            choices: departmentChoices,
        })
        .then((answer) => {
// calculate the total salary for the selected department
            const query =
            `SELECT
            departments.department_name AS department,
            SUM(roles.salary) AS total_salary
            FROM
            departments
            INNER JOIN employee ON roles.id = employee.role_id
            WHERE
            departments.id = ?
            GROUP BY
            departments.id;`;
            connection.query(query, [answer.departmentId], (err, res) => {
                if (err) throw err;
                const totalSalary = res[0].total_salary;
                console.log(
                    `The total salary for employees in this department is $${totalSalary}`
                );
                // restart the application
                start();
            });
        });
    });
}

// close the connection when the application exits
process.on("exit", () => {
    connection.end();
});