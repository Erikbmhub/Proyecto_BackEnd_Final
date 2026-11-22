const queries = {
    // Consulta para crear un usuario.
    createUser: `
        INSERT INTO users (username, password, email, role) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *;
    `,

    // Consulta para buscar un usuario por su nombre.
    findUserByUsername: `
        SELECT * FROM users WHERE username = $1;
    `,

    // Consulta para buscar un usuario por su correo electrónico.
    findUserByEmail: `
        SELECT * FROM users WHERE email = $1;
    `,

    // Consulta para obtener todos los usuarios registrados.
    getAllUsers: `
        SELECT id, username, email, role, created_at
        FROM public.users
        ORDER BY created_at DESC;
    `,

    // Consulta para actualizar un usuario.
    updateUser: `
        UPDATE users
        SET username = $1, email = $2, role = $3
        WHERE id = $4
        RETURNING id, username, email, role, created_at;
    `,

    // Consulta para eliminar un usuario.
    deleteUser: `
        DELETE FROM users
        WHERE id = $1
        RETURNING id;
    `
};

// Exportamos las consultas.
module.exports = queries;