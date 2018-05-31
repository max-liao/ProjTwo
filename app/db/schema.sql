CREATE DATABASE project2_db;

USE project2_db;

CREATE TABLE food_truck
(
	id int NOT NULL AUTO_INCREMENT,
	foodtruck_name varchar(100) NOT NULL,
    descr VARCHAR(250),
    cuisine VARCHAR(100),
    location VARCHAR(300) NOT NULL,
	date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    contact VARCHAR(50),
	PRIMARY KEY (id)
);

CREATE TABLE truck_location
(
	id int NOT NULL AUTO_INCREMENT,
	truck_id int NOT NULL,
	location varchar(500) NOT NULL,
	start_date DATETIME NOT NULL,
	end_date DATETIME,
    message VARCHAR(255),
	PRIMARY KEY (id),
	FOREIGN KEY (truck_id) REFERENCES food_truck(id)
);


CREATE TABLE truck_menu
(
	id int NOT NULL AUTO_INCREMENT,
	truck_id int NOT NULL,
	menu_item varchar(150) NOT NULL,
	menu_description VARCHAR(500) NOT NULL,
	price DECIMAL(6,2) NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (truck_id) REFERENCES food_truck(id)
);
