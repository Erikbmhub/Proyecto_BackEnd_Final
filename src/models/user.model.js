const bcrypt = require('bcryptjs');
const queries = require('../queries/user.queries.js');
const { executeQuery, executeQueryAll, executeQueryResult } = require('../utils/dbUtils.js');

async function createUser(name, email, role="user", password) {
    console.log('Creating user with data:', { name, email, role,  password});
    
    if (!name || !email || !role|| !password) {
        throw new Error('Faltan argumentos obligatorios para crear el usuario');
    }
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const values = [name, hashedPassword, email, role];
    return await executeQuery(queries.createUser, values);
}

async function findUserByUsername(username) {
    try {
        const values = [username];
        return await executeQuery(queries.findUserByUsername, values);
    } catch (error) {
        console.error('Error finding user by username:', error.message);
        throw new Error('Error al buscar el usuario por nombre de usuario');
    }
}

async function findUserByEmail(email) {
    try {
        const values = [email];
        return await executeQuery(queries.findUserByEmail, values);
    } catch (error) {
        console.error('Error finding user by email:', error.message);
        throw new Error('Error al buscar el usuario por correo electrónico');
    }
}
// Función para obtener todos los usuarios registrados.
async function getAllUsers() {
    try {
        return await executeQueryAll(queries.getAllUsers);
    } catch (error) {
        console.error('Error getting all users:', error.message);
        throw new Error('Error al obtener los usuarios registrados');
    }
}
// Función para actualizar los datos de un usuario.
async function updateUser(username, email, role, id) {
    const values = [username, email, role, id];
    return await executeQueryResult(queries.updateUser, values);
}

// Función para eliminar un usuario.
async function deleteUser(id) {
    const values = [id];
    return await executeQueryResult(queries.deleteUser, values);
}
module.exports = {
    createUser,
    findUserByUsername,
    findUserByEmail,
    getAllUsers,
    updateUser,
    deleteUser
};