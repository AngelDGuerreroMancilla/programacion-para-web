-- 1. Crear la base de datos
CREATE DATABASE IF NOT EXISTS `node-login-tutorial`;

-- 2. Seleccionarla para usarla
USE `node-login-tutorial`;

-- 3. Crear la tabla de usuarios
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) NOT NULL,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `registered` DATETIME NOT NULL,
  `last_login` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;