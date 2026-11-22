const { body } = require("express-validator");
const { handleValidationErrors } = require("../middlewares/validate.middleware");

// Contraseñas débiles o clichés habituales que conviene bloquear explícitamente
const COMMON_PASSWORDS = new Set([
    "123456",
    "1234567",
    "12345678",
    "123456789",
    "1234567890",
    "password",
    "password123",
    "qwerty",
    "qwerty123",
    "abc123",
    "admin123",
    "letmein",
    "welcome",
    "iloveyou",
]);

const signupValidation = [
    body("username")
        .trim()
        .notEmpty().withMessage("El nombre de usuario es obligatorio")
        .isLength({ min: 3, max: 30 }).withMessage("El nombre de usuario debe tener entre 3 y 30 caracteres")
        .matches(/^[a-zA-Z0-9._-]+$/).withMessage("El nombre de usuario solo puede contener letras, números, puntos, guiones y guiones bajos")
        .custom((value) => {
            if (/^[._-]|[._-]$/.test(value)) {
                throw new Error("El nombre de usuario no puede empezar ni terminar con un símbolo");
            }
            if (/[._-]{2}/.test(value)) {
                throw new Error("El nombre de usuario no puede contener símbolos consecutivos");
            }
            return true;
        }),

    body("email")
        .trim()
        .notEmpty().withMessage("El correo electrónico es obligatorio")
        .isLength({ max: 254 }).withMessage("El correo electrónico es demasiado largo")
        .isEmail({
            allow_utf8_local_part: false,
            require_tld: true,
        }).withMessage("Introduce un correo electrónico válido")
        .normalizeEmail({
            gmail_remove_dots: false,
        }),

    body("password")
        .notEmpty().withMessage("La contraseña es obligatoria")
        .isLength({ min: 8, max: 128 }).withMessage("La contraseña debe tener entre 8 y 128 caracteres")
        .matches(/[a-z]/).withMessage("La contraseña debe incluir al menos una letra minúscula")
        .matches(/[A-Z]/).withMessage("La contraseña debe incluir al menos una letra mayúscula")
        .matches(/\d/).withMessage("La contraseña debe incluir al menos un número")
        .matches(/[^A-Za-z0-9]/).withMessage("La contraseña debe incluir al menos un carácter especial (ej. !@#$%&*)")
        .custom((value, { req }) => {
            const normalized = value.toLowerCase();

            if (COMMON_PASSWORDS.has(normalized)) {
                throw new Error("Esta contraseña es demasiado común; elige una más segura");
            }

            if (/\s/.test(value)) {
                throw new Error("La contraseña no puede contener espacios en blanco");
            }

            // Evitar secuencias obvias consecutivas (ej. 1234, abcd)
            if (/(.)\1{3,}/.test(value)) {
                throw new Error("Evita repetir el mismo carácter 4 o más veces seguidas");
            }

            // Evitar que la contraseña contenga el username o la parte local del email
            const username = (req.body.username || "").trim().toLowerCase();
            const emailLocal = (req.body.email || "").split("@")[0].trim().toLowerCase();

            if (username.length >= 3 && normalized.includes(username)) {
                throw new Error("La contraseña no debe contener tu nombre de usuario");
            }

            if (emailLocal.length >= 3 && normalized.includes(emailLocal)) {
                throw new Error("La contraseña no debe contener parte de tu correo electrónico");
            }

            return true;
        }),

    body("confirmPassword")
        .notEmpty().withMessage("Debes confirmar la contraseña")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Las contraseñas no coinciden");
            }
            return true;
        }),

    // En registro público bloqueamos o restringimos explícitamente role para evitar escalada de privilegios
    body("role")
        .optional()
        .equals("user").withMessage("No tienes permiso para asignar este rol"),

    handleValidationErrors,
];

const loginValidation = [
    body("email")
        .trim()
        .notEmpty().withMessage("El correo electrónico es obligatorio")
        .isEmail().withMessage("Introduce un correo electrónico válido")
        .normalizeEmail({
            gmail_remove_dots: false,
        }),

    body("password")
        .notEmpty().withMessage("La contraseña es obligatoria")
        .isLength({ max: 128 }).withMessage("Contraseña no válida"),

    handleValidationErrors,
];

module.exports = {
    signupValidation,
    loginValidation,
};