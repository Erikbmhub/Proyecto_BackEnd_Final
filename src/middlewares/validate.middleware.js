const { validationResult } = require("express-validator");

function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    const formattedErrors = errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
    }));

    const primaryMessage = formattedErrors[0].message;

    const wantsJson =
        req.xhr ||
        req.headers["x-requested-with"] === "XMLHttpRequest" ||
        req.is("application/json") ||
        (req.headers.accept && req.headers.accept.includes("application/json"));

    if (wantsJson) {
        return res.status(400).json({
            message: primaryMessage,
            errors: formattedErrors,
        });
    }

    return res.status(400).send(primaryMessage);
}

module.exports = {
    handleValidationErrors,
};