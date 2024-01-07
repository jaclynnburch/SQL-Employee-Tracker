INSERT INTO department (department_name)
VALUES
('Admin'),
('Human Resources'),
('Finance'),
('Engineering'),
('Maintenance'),
('Legal'),
('Manager');


INSERT INTO role (title, salary, department_id)
VALUES
('Administrative Director', 100000.00, 1),
('HR Manager', 195000.00, 2),
('HR Specialist', 95000.00, 2),
('Director of Finance', 95000.00, 3),
('Finance Specialist', 85000.00, 3),

('CTO', 195000.00, 4),
('Senior Engineer', 95000.00, 4),
('Maintenance Manager', 80000.00, 5),
('Compliance Director', 95000.00, 6),
('Executive Management', 110000.00, 7);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Courteney', 'Cox', 1, null),
('Rachel', 'Green', 2, null),
('Phoebe', 'Buffay', 3, 2),
('Chandler', 'Bing', 4, null),
('Joey', 'Tibbiani', 5, 4),
('Ross', 'Geller', 6, null),
('Monica', 'Geller', 7, 6);