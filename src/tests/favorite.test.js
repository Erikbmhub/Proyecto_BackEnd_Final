const mockSave = jest.fn();

jest.mock("../models/favorite.model.js", () => {
  const mockFavorite = jest.fn().mockImplementation(function (data) {
    Object.assign(this, data);
    this.save = mockSave;
  });

  mockFavorite.find = jest.fn();
  mockFavorite.findOne = jest.fn();
  mockFavorite.findOneAndDelete = jest.fn();

  return mockFavorite;
});

const Favorite = require("../models/favorite.model.js");
const {
  getFavorites,
  postFavorites,
  deleteFavorites,
} = require("../controllers/favorites.controller.js");

function createResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe("controlador de favoritos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("devuelve los favoritos del usuario autenticado", async () => {
    const favorites = [{ tmdbId: 42, title: "Película" }];
    Favorite.find.mockResolvedValue(favorites);

    const req = { user: { id: 7 } };
    const res = createResponse();

    await getFavorites(req, res);

    expect(Favorite.find).toHaveBeenCalledWith({ userId: 7 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(favorites);
  });

  test("rechaza un identificador TMDb no válido", async () => {
    const req = {
      user: { id: 7 },
      body: { tmdbId: "no-es-un-numero", title: "Película" },
    };
    const res = createResponse();

    await postFavorites(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(Favorite.findOne).not.toHaveBeenCalled();
  });

  test("rechaza una película que ya está en favoritos", async () => {
    Favorite.findOne.mockResolvedValue({ tmdbId: 42 });

    const req = {
      user: { id: 7 },
      body: { tmdbId: "42", title: "Película" },
    };
    const res = createResponse();

    await postFavorites(req, res);

    expect(Favorite.findOne).toHaveBeenCalledWith({
      userId: 7,
      tmdbId: 42,
    });
    expect(res.status).toHaveBeenCalledWith(409);
  });

  test("guarda un favorito nuevo", async () => {
    Favorite.findOne.mockResolvedValue(null);
    mockSave.mockResolvedValue(undefined);

    const req = {
      user: { id: 7 },
      body: { tmdbId: "42", title: "  Película  " },
    };
    const res = createResponse();

    await postFavorites(req, res);

    expect(Favorite).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 7,
        tmdbId: 42,
        title: "Película",
      }),
    );
    expect(mockSave).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("responde 404 si el favorito que se quiere borrar no existe", async () => {
    Favorite.findOneAndDelete.mockResolvedValue(null);

    const req = {
      user: { id: 7 },
      params: { tmdbId: "42" },
      body: {},
    };
    const res = createResponse();

    await deleteFavorites(req, res);

    expect(Favorite.findOneAndDelete).toHaveBeenCalledWith({
      userId: 7,
      tmdbId: 42,
    });
    expect(res.status).toHaveBeenCalledWith(404);
  });
});