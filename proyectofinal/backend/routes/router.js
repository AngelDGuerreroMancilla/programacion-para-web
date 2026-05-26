import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import db from '../lib/db.js'; 
import userMiddleware from '../middleware/users.js'; 

const router = express.Router();




// registrarse
router.post('/sign-up', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario ya existe
    const [usuariosExistentes] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (usuariosExistentes.length > 0) {
      return res.status(409).json({ mensaje: 'Este correo ya está registrado.' });
    }

    // Encriptar la contraseña, 10 es texto aleatorio para hacer el hash  seguro
    const encrip = await bcrypt.hash(password, 10);

    // Guardar en la base de datos 
    await db.query('INSERT INTO usuarios (email, password) VALUES (?, ?)', [email, encrip]);

    res.status(201).json({ mensaje: 'Usuario registrado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
});

// login y generacion de token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar al usuario por email, siempre se pone correo o contraseña incorrectos para no dar informacion  a atacantes
    const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (usuarios.length === 0) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos.' });
    }
    //guardamos el primer resultado del email que debe ser unico.
    const usuario = usuarios[0];

    // Comparar contraseñas
    const contraseña = await bcrypt.compare(password, usuario.password);
    if (!contraseña) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos.' });
    }

    // generar el Token de 7 dias 
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } 
    );

    // enviar el token y los datos básicos al frontend
    res.status(200).json({
      mensaje: 'Login exitoso',
      token: token,
      usuario: { id: usuario.id, email: usuario.email, rol: usuario.rol }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
});




// recuperarar los productos
router.get('/productos', userMiddleware.isLoggedIn, async (req, res) => {
  try {
    const [productos] = await db.query('SELECT * FROM productos');
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener productos', error: error.message });
  }
});

// buscar productos
router.get('/productos/buscar', userMiddleware.isLoggedIn, async (req, res) => {
  try {
    const terminoBusqueda = req.query.q; 
    const [productos] = await db.query('SELECT * FROM productos WHERE nombre LIKE ?', [`%${terminoBusqueda}%`]);
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar productos', error: error.message });
  }
});

// recuperar los pedidos del usuario logueado
router.get('/mis-pedidos', userMiddleware.isLoggedIn, async (req, res) => {
  try {
    const idUsuario = req.userData.id;
    
    const [pedidos] = await db.query('SELECT id, total, fecha_pedido FROM pedidos WHERE usuario_id = ? ORDER BY fecha_pedido DESC', [idUsuario]);

    for (let pedido of pedidos) {
        const [detalles] = await db.query(`
            SELECT pd.cantidad, pd.precio_unitario, p.nombre 
            FROM pedido_detalles pd 
            JOIN productos p ON pd.producto_id = p.id 
            WHERE pd.pedido_id = ?
        `, [pedido.id]);
        
        pedido.carrito = detalles; 
    }

    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener pedidos', error: error.message });
  }
});

// crear pedido en el carrito (
router.post('/pedidos', userMiddleware.isLoggedIn, async (req, res) => {
  try {
    const idUsuario = req.userData.id;
    const { total, carrito } = req.body; 

  
    const [resultadoPedido] = await db.query(
      'INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)',
      [idUsuario, total]
    );
    
    const pedidoId = resultadoPedido.insertId;

    for (const item of carrito) {
        await db.query(
            'INSERT INTO pedido_detalles (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
            [pedidoId, item.producto_id, item.cantidad, item.precio_unitario]
        );
    }

    res.status(201).json({ mensaje: 'Pedido creado exitosamente', id_pedido: pedidoId });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el pedido', error: error.message });
  }
});






// recuperar clientes
router.get('/admin/clientes', userMiddleware.isLoggedIn, userMiddleware.isAdmin, async (req, res) => {
  try {
    // Traemos a los usuarios que sean clientes (no traemos las contraseñas por seguridad)
    const [clientes] = await db.query('SELECT id, email, created_at FROM usuarios WHERE rol = "cliente"');
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener clientes', error: error.message });
  }
});

// agregar productos
router.post('/admin/productos', userMiddleware.isLoggedIn, userMiddleware.isAdmin, async (req, res) => {
  try {
    const { nombre, descripcion, precio, imagen } = req.body;
    
    await db.query(
      'INSERT INTO productos (nombre, descripcion, precio, imagen) VALUES (?, ?, ?, ?)',
      [nombre, descripcion, precio, imagen]
    );

    res.status(201).json({ mensaje: 'Producto agregado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al agregar producto', error: error.message });
  }
});

// modificar producto 
router.put('/admin/productos/:id', userMiddleware.isLoggedIn, userMiddleware.isAdmin, async (req, res) => {
  try {
    const idProducto = req.params.id; 
    const { nombre, descripcion, precio, imagen } = req.body;

    await db.query(
      'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, imagen = ? WHERE id = ?',
      [nombre, descripcion, precio, imagen, idProducto]
    );

    res.status(200).json({ mensaje: 'Producto actualizado ' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al modificar ', error: error.message });
  }
});

export default router;