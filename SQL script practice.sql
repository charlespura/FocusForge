CREATE DATABASE  practice_analytics;

USE  practice_analytics;

CREATE TABLE departments(
    dept_id int PRIMARY KEY,
    dept_name varchar (40) NOT NULL,
    budget int NOT NULL

);

CREATE TABLE projects (
    project_id int PRIMARY KEY,
    project_name varchar (50) NOT NULL,
    project_type varchar (50) NOT NULL,
    dept_id INT,
    project_budget int NOT NULL,
    project_status varchar (20) NOT NULL,
    project_description varchar (100) NOT NULL,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);



CREATE TABLE employees(
    emp_id int Primary key,
    first_name varchar (20) NOT NULL,
    last_name varchar (20) NOT NULL,
    address varchar (50) NOT NULL,
    contact_number varchar (50) NOT NULL,
    dept_id INT,
     FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

 SELECT * FROM departments;
 SELECT * FROM projects;
 SELECT * FROM employees;

 SELECT 
    e.first_name,
    e.last_name,
     e.address,
    e.contact_number,
    d.dept_name,
    p.project_name,
    p.project_type,
    p.project_budget,
    p.project_status

FROM employees e
inner join departments d 
   on e.dept_id = d.dept_id
inner join projects p
   on e.dept_id = p.dept_id ;





