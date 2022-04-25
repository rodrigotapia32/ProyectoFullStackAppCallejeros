CREATE DATABASE street;
\c street

CREATE TABLE users(
id SERIAL PRIMARY KEY,
first_name VARCHAR(45),
last_name VARCHAR(45),
password VARCHAR(100),
phone VARCHAR(25),
email VARCHAR(45),
UNIQUE(email)
);

CREATE TABLE posts(
id SERIAL,
photo VARCHAR(45),
address VARCHAR(100), 
description TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
userId INT REFERENCES users(id) 
);
