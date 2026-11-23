jest.mock("../models/user.model.js", () => ({
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
  findUserByUsername: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "token-de-prueba"),
}));

const {
  createUser,
  findUserByEmail,
  findUserByUsername,
} = require("../models/user.model.js");
const { register } = require("../controllers/auth.controller.js");

function createResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis(),
    cookie: jest.fn().mockReturnThis(),
  };
}

describe("registro de usuarios", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    findUserByEmail.mockResolvedValue(null);
    findUserByUsername.mockResolvedValue(null);
  });

  test("responde 400 cuando faltan campos obligatorios", async () => {
    const req = {
      body: { username: "ana", email: "ana@example.com" },
    };
    const res = createResponse();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      "Todos los campos son obligatorios",
    );
    expect(createUser).not.toHaveBeenCalled();
  });

  test("responde 400 si las contraseñas no coinciden", async () => {
    const req = {
      body: {
        username: "ana",
        email: "ana@example.com",
        password: "clave-1",
        confirmPassword: "clave-2",
      },
    };
    const res = createResponse();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      "Las contraseñas no coinciden",
    );
    expect(createUser).not.toHaveBeenCalled();
  });

  test("crea el usuario, guarda una cookie y redirige al dashboard", async () => {
    createUser.mockResolvedValue({ id: 1, role: "user" });

    const req = {
      body: {
        username: "ana",
        email: "ana@example.com",
        password: "clave-segura",
        confirmPassword: "clave-segura",
      },
    };
    const res = createResponse();

    await register(req, res);

    expect(createUser).toHaveBeenCalledWith(
      "ana",
      "ana@example.com",
      "user",
      "clave-segura",
    );
    expect(res.cookie).toHaveBeenCalledWith(
      "token",
      "token-de-prueba",
      { httpOnly: true },
    );
    expect(res.redirect).toHaveBeenCalledWith("/dashboard");
  });
});