jest.mock("../config/db.mongo.js", () => ({}));
jest.mock("../services/tmdb.service.js", () => jest.fn());

jest.mock("../models/movie.model.js", () => ({
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  find: jest.fn(),
  insertMany: jest.fn(),
}));

const MovieModel = require("../models/movie.model.js");
const {
  getMovie,
  putMovie,
  deleteMovie,
} = require("../controllers/movies.controller.js");

function createResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe("controlador de películas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("la búsqueda responde 400 si no recibe título", async () => {
    const req = { query: {} };
    const res = createResponse();

    await getMovie(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "Debes indicar el título de la película",
    });
  });

  test("actualiza una película y responde 200", async () => {
    const updatedMovie = {
      _id: "id-1",
      title: "Película actualizada",
      tmdbId: 42,
    };
    MovieModel.findByIdAndUpdate.mockResolvedValue(updatedMovie);

    const req = {
      body: {
        id: "id-1",
        title: "Película actualizada",
        tmdbId: 42,
        image: "https://example.com/poster.jpg",
        year: 2024,
        director: "Directora",
        genre: "Drama",
        duration: "120",
      },
    };
    const res = createResponse();

    await putMovie(req, res);

    expect(MovieModel.findByIdAndUpdate).toHaveBeenCalledWith(
      "id-1",
      expect.objectContaining({
        title: "Película actualizada",
        tmdbId: 42,
      }),
      { returnDocument: "after", runValidators: true },
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ movie: updatedMovie }),
    );
  });

  test("responde 404 si la película que se quiere actualizar no existe", async () => {
    MovieModel.findByIdAndUpdate.mockResolvedValue(null);

    const req = {
      body: { id: "id-inexistente" },
    };
    const res = createResponse();

    await putMovie(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "Película no encontrada",
    });
  });

  test("borra una película y responde 200", async () => {
    MovieModel.findByIdAndDelete.mockResolvedValue({ _id: "id-1" });

    const req = { body: { id: "id-1" } };
    const res = createResponse();

    await deleteMovie(req, res);

    expect(MovieModel.findByIdAndDelete).toHaveBeenCalledWith("id-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "Película eliminada correctamente",
    });
  });

  test("responde 404 si la película que se quiere borrar no existe", async () => {
    MovieModel.findByIdAndDelete.mockResolvedValue(null);

    const req = { body: { id: "id-inexistente" } };
    const res = createResponse();

    await deleteMovie(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "Película no encontrada",
    });
  });
});