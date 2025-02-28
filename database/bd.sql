CREATE DATABASE street;
\c street

CREATE TABLE users(
id SERIAL PRIMARY KEY,
first_name VARCHAR(45) NOT NULL,
last_name VARCHAR(45) NOT NULL,
password VARCHAR(100) NOT NULL,
phone VARCHAR(25) NOT NULL,
email VARCHAR(45) NOT NULL,
UNIQUE(email)
);

CREATE TABLE posts(
id SERIAL,
photo VARCHAR(45) NOT NULL,
address VARCHAR(100) NOT NULL, 
description TEXT NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
userId INT REFERENCES users(id) 
);

-- SELECT photo address, description, created_at, first_name, phone, email FROM users INNER JOIN posts ON users.id = posts.userId;
