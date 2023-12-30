INSERT INTO departments (department_name)
VALUES
('Admin'),
('Human Resources'),
('Finance'),
('Engineering'),
('Maintenance'),
('Legal'),
('Manager');


INSERT INTO roles (title, salary, department_id)
VALUES
('Administrative Director', 100000.00, 1),
('HR Specialist', 95000.00, 2),
('Director of Finance', 95000.00, 3),
('Senior Engineer', 95000.00, 4),
('Maintenance Manager', 80000.00, 5),
('Compliance Director', 95000.00, 6),
('Executive Management', 110000.00, 7);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
('Courteney', 'Cox', 1, 1),
('Rachel', 'Green', 2, 2),
('Phoebe', 'Buffay', 3, 3),
('Chandler', 'Bing', 4, 4),
('Joey', 'Tibbiani', 5, 5),
('Ross', 'Geller', 6, 6),
('Monica', 'Geller', 7, 7),