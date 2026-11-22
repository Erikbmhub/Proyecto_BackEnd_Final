const pool = require('../config/db.postgres.js');

// Método genérico para ejecutar consultas SQL
async function executeQuery(query, values) {
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query:', error.message);
        throw new Error('Error al ejecutar la consulta');
    }
}
// Método genérico para ejecutar consultas que devuelven varios registros.
async function executeQueryAll(query, values) {
    try {
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.error('Error executing query:', error.message);
        throw new Error('Error al ejecutar la consulta');
    }
}
// Método genérico para ejecutar consultas y devolver el resultado completo.
async function executeQueryResult(query, values) {
    try {
        const result = await pool.query(query, values);
        return result;
    } catch (error) {
        console.error('Error executing query:', error.message);
        throw new Error('Error al ejecutar la consulta');
    }
}

module.exports = { executeQuery,executeQueryAll, executeQueryResult };