const { Pool } = require('pg');

require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
})

const prueba = async () =>{
    // Abrir conexión
    const client = await pool.connect();

    // Lanzar petición SQL
    const result = await client.query("SELECT NOW()");
    console.log("Conectado a la BBDD: "+result.rows[0].now);
    
    // Cerrar conexión
    client.release();
}

prueba();

module.exports = pool;