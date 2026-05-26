# Tienda en Línea - Proyecto Final

Este proyecto es para un e-commerce. Cuenta con un frontend interactivo en HTML/CSS/JS y una API RESTful construida con Node.js y MySQL.

## Funcionalidades del Cliente (Interfaz Web)

Desde el frontend, los usuarios pueden realizar las siguientes acciones a través de la interfaz visual:
- Registrar una cuenta nueva en el sistema.
- Iniciar sesión para obtener su token de acceso.
- Navegar y recuperar todo el catálogo de productos disponibles.
- Buscar productos específicos mediante la barra de búsqueda.
- Armar un carrito de compras interactivo.
- Realizar la compra (crear un pedido vinculado al usuario con uno o más productos).
- Recuperar y visualizar su historial de pedidos anteriores.

La API protege las rutas operativas. El frontend se encarga de enviar automáticamente el token de autorización (Bearer) en los encabezados de cada petición HTTP.*

## Operaciones de Administrador (Comandos cURL)

El sistema cuenta con un usuario administrador configurado directamente en la base de datos. Para cumplir con los requerimientos, las acciones de administración no cuentan con interfaz gráfica y deben ejecutarse mediante peticiones cURL desde la terminal.

> **Importante:** Primero debes ejecutar el comando de loguearse para obtener el Token JWT. En los comandos posteriores, reemplaza `<TU_TOKEN>` con el código generado.

### 1. Loguearse como Administrador
```bash
curl -X POST http://localhost:3000/api/login \
-H "Content-Type: application/json" \
-d '{"email":"admin@admin.com", "password":"admin123"}'

2. Recuperar todos los clientes

Devuelve la lista de todos los usuarios registrados con el rol de "cliente".
Bash

curl -X GET http://localhost:3000/api/admin/clientes \
-H "Authorization: Bearer <TU_TOKEN>"

3. Recuperar todos los productos

Devuelve el catálogo completo de productos de la tienda.
Bash

curl -X GET http://localhost:3000/api/productos \
-H "Authorization: Bearer <TU_TOKEN>"

4. Agregar un producto nuevo

Crea un nuevo producto en el catálogo. Este ejemplo inserta unas Sabritas con un precio de $20.00 pesos y su respectiva imagen.
Bash

curl -X POST http://localhost:3000/api/admin/productos \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TU_TOKEN>" \
-d '{"nombre":"Sabritas Sal", "descripcion":"Botana salada clásica", "precio": 20.00, "imagen": "[https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdzKP37zYogbr35uqD56WaWoqT6Lp4h_sCww&s](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdzKP37zYogbr35uqD56WaWoqT6Lp4h_sCww&s)"}'

5. Modificar un producto (Método PUT)

Actualiza los datos de un producto existente. En este ejemplo se actualiza el producto con el ID 1 indicándolo al final de la URL (/productos/1).
Bash

curl -X PUT http://localhost:3000/api/admin/productos/1 \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TU_TOKEN>" \
-d '{"nombre":"Producto Editado", "descripcion":"Se actualizó el producto correctamente", "precio": 25.00, "imagen": "[https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdzKP37zYogbr35uqD56WaWoqT6Lp4h_sCww&s](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdzKP37zYogbr35uqD56WaWoqT6Lp4h_sCww&s)"}'