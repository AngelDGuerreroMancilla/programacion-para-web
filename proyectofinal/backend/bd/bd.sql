
DROP DATABASE IF EXISTS ecommerce_db;
CREATE DATABASE ecommerce_db;
USE ecommerce_db;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('cliente', 'admin') DEFAULT 'cliente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    imagen VARCHAR(500), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    carrito JSON NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



INSERT INTO productos (nombre, descripcion, precio, imagen) VALUES 
('Bolitochas', 'Dulces confitados sabor sandía', 57.00, 'https://confitadosfinos.com.mx/wp-content/uploads/2023/01/d_R203_Bolitochas-Sand%C2%A1a-1.jpg'),
('Nescafé', 'Café clásico soluble', 499.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCOWwHmNOMOtsji7lilcqUfp4S7HTuhM8OWA&s'),
('Lechuguillas', 'Bebida refrescante', 12.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSqvif48qyt4eyqzjPFx6XLhiolvM-BZhkhg&s'),
('Jabón Salvo', 'Lavatrastes líquido', 43.00, 'https://www.movil.farmaciasguadalajara.com/wcsstore/FGCAS/wcs/products/1450280_A_1280_AL.jpg'),
('Helados Bon', 'Helado de chocolate', 120.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXQ9-W7Dx9yglatXPi6snMiUtCEnn6NZ5VNw&s'),
('Aire Premium', 'Botella de aire puro', 5000.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf1dakgdfMHmn-0HTboLt0sUzqSgSgB4d7jQ&s'),
('Galletas Senzo', 'Galletas rellenas', 22.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-j9ro-Yjx_PS8CQY5Uu87Pb_FnyWZuSazIQ&s');