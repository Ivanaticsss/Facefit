CREATE DATABASE IF NOT EXISTS facefit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE facefit_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','user','hairstylist') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO users (full_name, username, email, password_hash, role) VALUES
  ('Admin User', 'admin', 'admin@facefit.test', '$2y$10$C9hJQhD2O4r0M7bJY0ciX.1l7M8b8m6XQ2Wm6s4I2d4S4K4h2dJ6', 'admin'),
  ('Regular User', 'user', 'user@facefit.test', '$2y$10$7KXk1K8V8PPY0Po3qfQfWez9W0Dfb3HHQ4N2qU8v7kG6h3D2jQYkq', 'user'),
  ('Hairstylist User', 'stylist', 'stylist@facefit.test', '$2y$10$4jhV0pr0sNQG0gY9S5wY6eJ7sC3j8b58Q3YQn9jP1p2mK9z3L9o6q', 'hairstylist')
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  email = VALUES(email),
  password_hash = VALUES(password_hash),
  role = VALUES(role);
