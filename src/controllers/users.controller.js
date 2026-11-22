// Importamos las funciones del modelo de usuarios.
const { createUser, updateUser, deleteUser } = require("../models/user.model");

async function getUsers(req, res) {
    // Pendiente de implementar.
}

// Crear un usuario desde la administración.
async function createUserAdmin(req, res) {
    const { username, email, password } = req.body;

    try {
        // Comprobamos que los campos sean obligatorios.
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Todos los campos son obligatorios"
            });
        }

        // Creamos el usuario con rol user por defecto.
        const user = await createUser(username, email, "user", password);

        // Devolvemos los datos del usuario creado.
        res.status(201).json({
            message: "Usuario creado correctamente",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Error al crear el usuario:", error.message);
        res.status(500).json({ message: "Error al crear el usuario" });
    }
}

async function putUsers(req, res) {
    const { username, email, role } = req.body;
    const { id } = req.params;

    try {
        // Actualizamos el usuario en la base de datos.
        const result = await updateUser(username, email, role, id);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error("Error al actualizar el usuario:", error.message);
        res.status(500).json({ message: "Error al actualizar el usuario" });
    }
}

async function deleteUsers(req, res) {
    const { id } = req.params;

    try {
        // Eliminamos el usuario de la base de datos.
        const result = await deleteUser(id);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({
            message: "Usuario eliminado correctamente"
        });

    } catch (error) {
        console.error("Error al eliminar el usuario:", error.message);
        res.status(500).json({ message: "Error al eliminar el usuario" });
    }
}

// Exportamos las funciones del controlador.
module.exports = {
    getUsers,
    createUserAdmin,
    putUsers,
    deleteUsers
};