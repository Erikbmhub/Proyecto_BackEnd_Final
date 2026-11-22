// Esperamos a que el documento HTML esté cargado.
document.addEventListener("DOMContentLoaded", () => {
  // Recuperamos todos los botones de editar película.
  const editButtons = document.querySelectorAll(".btn-edit-movie");

  // Recorremos los botones de edición.
  editButtons.forEach((button) => {
    // Escuchamos el clic sobre cada botón.
    button.addEventListener("click", () => {
      // Recuperamos el artículo de la película seleccionada.
      const article = button.closest("article");

      // Recuperamos los datos de la película.
      const movie = {
        id: article.dataset.movieId,
        title: article.dataset.title,
        tmdbId: article.dataset.tmdbId,
        image: article.dataset.image,
        year: article.dataset.year,
        director: article.dataset.director,
        genre: article.dataset.genre,
        duration: article.dataset.duration,
      };

      // Comprobamos los datos recuperados.
      console.log("Película seleccionada:", movie);

      // Evitamos crear varios formularios al pulsar varias veces.
      const existingForm = document.querySelector("#edit-movie-form");

      if (existingForm) {
        if (existingForm.dataset.movieId === movie.id) {
          existingForm.remove();
          return;
        }

        existingForm.remove();
      }

      // Creamos el formulario de edición.
      const form = document.createElement("form");
      form.id = "edit-movie-form";

      // Guardamos el ID de la película que estamos editando.
      form.dataset.movieId = movie.id;

      // Añadimos los campos con los datos actuales.
      form.innerHTML = `
        <h3>Editar película</h3>

        <label>Título</label>
        <input type="text" name="title" value="${movie.title}" required>

        <label>Identificador TMDb</label>
        <input type="number" name="tmdbId" value="${movie.tmdbId}" required>

        <label>Imagen</label>
        <input type="url" name="image" value="${movie.image}" required>

        <label>Año</label>
        <input type="number" name="year" value="${movie.year}" required>

        <label>Director</label>
        <input type="text" name="director" value="${movie.director}" required>

        <label>Género</label>
        <input type="text" name="genre" value="${movie.genre}" required>

        <label>Duración</label>
        <input type="text" name="duration" value="${movie.duration}" required>

        <button type="submit">Guardar cambios</button>
        <button type="button" id="cancel-edit">Cancelar</button>
      `;

      // Insertamos el formulario debajo de la película seleccionada.
      article.after(form);

      // Escuchamos el envío del formulario.
      form.addEventListener("submit", async (event) => {
        // Evitamos que el navegador recargue la página.
        event.preventDefault();

        // Recuperamos los datos introducidos en el formulario.
        const formData = new FormData(form);

        // Convertimos los datos del formulario en un objeto.
        const movieData = Object.fromEntries(formData.entries());

        // Añadimos el ID de la película que queremos actualizar.
        movieData.id = form.dataset.movieId;

        // Comprobamos los datos que vamos a enviar.
        console.log("Datos para actualizar:", movieData);

        // Enviamos los datos al servidor para actualizar la película.
        const response = await fetch("/api/movie", {
          // Indicamos que queremos actualizar un recurso.
          method: "PUT",

          // Indicamos que enviamos los datos en formato JSON.
          headers: {
            "Content-Type": "application/json",
          },

          // Convertimos el objeto JavaScript en texto JSON.
          body: JSON.stringify(movieData),
        });

        // Convertimos la respuesta del servidor en un objeto JavaScript.
        const result = await response.json();

        // Mostramos el resultado recibido.
        console.log("Respuesta del servidor:", result);

        // Comprobamos si la actualización se ha realizado correctamente.
        if (response.ok) {
          // Recuperamos la película actualizada que devuelve el servidor.
          const updatedMovie = result.movie;

          // Actualizamos los datos del artículo.
          article.dataset.title = updatedMovie.title;
          article.dataset.tmdbId = updatedMovie.tmdbId;
          article.dataset.image = updatedMovie.image;
          article.dataset.year = updatedMovie.year;
          article.dataset.director = updatedMovie.director;
          article.dataset.genre = updatedMovie.genre;
          article.dataset.duration = updatedMovie.duration;

          // Actualizamos el cartel.
          article.querySelector(".movie-image").src = updatedMovie.image;

          // Actualizamos el título.
          article.querySelector(".movie-title").textContent =
            updatedMovie.title;

          // Actualizamos el año.
          article.querySelector(".movie-year").textContent =
            `Año: ${updatedMovie.year}`;

          // Actualizamos el director.
          article.querySelector(".movie-director").textContent =
            `Director: ${updatedMovie.director}`;

          // Actualizamos el género.
          article.querySelector(".movie-genre").textContent =
            `Género: ${updatedMovie.genre}`;

          // Actualizamos la duración.
          article.querySelector(".movie-duration").textContent =
            `Duración: ${updatedMovie.duration}`;

          // Cerramos el formulario de edición.
          form.remove();

          // Mostramos el mensaje del servidor.
          alert(result.mensaje);
        }
      });

      // Cerramos el formulario si pulsamos Cancelar.
      document.querySelector("#cancel-edit").addEventListener("click", () => {
        form.remove();
      });
    });
  });
  // Recuperamos todos los botones de eliminar película.
  const deleteButtons = document.querySelectorAll(".btn-delete-movie");

  // Recorremos los botones de eliminación.
  deleteButtons.forEach((button) => {
    // Escuchamos el clic sobre cada botón.
    button.addEventListener("click", async () => {
      // Recuperamos el artículo de la película seleccionada.
      const article = button.closest("article");

      // Recuperamos el ID de la película.
      const movieId = article.dataset.movieId;

      // Comprobamos el ID recuperado.
      console.log("ID de la película que queremos eliminar:", movieId);
      // Pedimos confirmación antes de eliminar la película.
      const confirmar = confirm("¿Seguro que quieres eliminar esta película?");

      // Si el usuario cancela, detenemos la eliminación.
      if (!confirmar) {
        return;
      }
      // Enviamos la petición al servidor para eliminar la película.
      const response = await fetch("/api/movie", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: movieId }),
      });

      // Convertimos la respuesta del servidor en un objeto JavaScript.
      const result = await response.json();

      // Comprobamos la respuesta recibida.
      console.log("Respuesta del servidor:", result); // Comprobamos si la eliminación se ha realizado correctamente.
      if (response.ok) {
        const editForm = document.querySelector("#edit-movie-form");
        if (editForm?.dataset.movieId === movieId) {
          editForm.remove();
        }

        // Eliminamos el artículo de la película de la página.
        article.remove();

        // Mostramos el mensaje del servidor.
        alert(result.mensaje);
      }
    });
  });
});
