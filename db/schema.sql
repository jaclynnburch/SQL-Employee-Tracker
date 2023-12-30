DROP DATABASE IF EXISTS employeeTracker_bd;
CREATE DATABASE employeeTracker_bd;
USE employeeTracker_bd;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(225) NOT NULL
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(225),
    salary DECIMAL (10,2),
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES departments (id)
    ON DELETE SET NULL
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT NOT NULL
);
