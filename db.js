import pg from 'pg'; 
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST,  
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port:process.env.DB_PORT
});

pool.connect()
    .then(() => console.log('Conexión exitosa a PostgreSQL 🎉'))
    .catch(err => console.error('Error de conexión:', err));

export default  pool;
