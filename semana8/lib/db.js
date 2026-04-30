import mysql from 'mysql2';


const connection= mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    database:process.env.DB_NAME,
    password:process.env.DB_PASSWORD
});


connection.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err.message);
    } else {
        console.log('Base de datos conectada correctamente.');
    }
});
export default connection;


