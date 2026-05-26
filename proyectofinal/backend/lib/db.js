import mysql from 'mysql2';
import dotenv from 'dotenv';

//variables de entorno desde el archivo .env
dotenv.config();

// pool para que soporte varias conexiones 
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0
});

//Convertimos el pool para que soporte Promesas 
const db = pool.promise();

// prueba de la conexión al iniciar
db.getConnection()
  .then(connection => {
    console.log('base de datos conectada.');
    connection.release(); // Liberamos la conexión de prueba
  })
  .catch(error => {
    console.error('Error al conectar a la base de datos:', error.message);
  });

// exportamos la conexión para usarla en el router
export default db;