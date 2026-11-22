// Importamos las funciones del modelo de usuarios.
const { createUser, updateUser, deleteUser } = require("../models/user.model");
// Importamos los modelos de MongoDB relacionados con el usuario.
const Favorite = require("../models/favorite.model");

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
    const userId = Number(id);

    console.log("1. req.params.id:", id, "| userId numérico:", userId);

    if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({
            message: "El identificador de usuario no es válido"
        });
    }

    try {
        const result = await deleteUser(userId);
        console.log("2. Resultado deleteUser (PG) rowCount:", result.rowCount);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        console.log("3. Mongo readyState:", Favorite.db.readyState, "| DB name:", Favorite.db.name, "| Collection:", Favorite.collection.name);

        const deletedFavorites = await Favorite.deleteMany({ userId });
        console.log("4. Borrados en Mongo:", deletedFavorites);

        res.status(200).json({
            message: "Usuario y toda su información asociada eliminados correctamente",
            deletedFavoritesCount: deletedFavorites.deletedCount
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