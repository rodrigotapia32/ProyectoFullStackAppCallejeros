CREATE DATABASE street;
\c street

CREATE TABLE users(
id SERIAL PRIMARY KEY,
usuario VARCHAR(45),
pass VARCHAR(100),
first_name VARCHAR(45),
last_name VARCHAR(45),
phone VARCHAR(25),
email VARCHAR(45)
);

CREATE TABLE posts(
id SERIAL,
photo VARCHAR(45),
address VARCHAR(100), 
description TEXT,
userId INT REFERENCES users(id) 
);


INSERT INTO users(first_name, last_name, phone, email) VALUES ('a', 'a', 'a', 'a');