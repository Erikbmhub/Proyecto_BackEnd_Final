// Esperamos a que el documento HTML esté cargado.
document.addEventListener("DOMContentLoaded", () => {
  console.log("USERS.JS CARGADO CORRECTAMENTE");
  // Recuperamos los formularios de usuarios.
  const createUserForm = document.querySelector("#user-form");
  const editUserForm = document.querySelector("#edit-user-form");
  const editUserSection = document.querySelector(".edit-user-form");
  const cancelEditButton = document.querySelector("#cancel-edit");

  // ==========================================
  // CREAR USUARIO
  // ==========================================

  // Escuchamos el envío del formulario de creación.
  if (createUserForm) {
    createUserForm.addEventListener("submit", async (event) => {
      console.log("FORMULARIO DE CREACIÓN DETECTADO");
      // Evitamos que el navegador recargue la página.
      event.preventDefault();

      // Recuperamos los datos introducidos.
      const formData = new FormData(createUserForm);

      // Convertimos los datos en un objeto JavaScript.
      const userData = Object.fromEntries(formData.entries());

      try {
        // Enviamos los datos al servidor para crear el usuario.
        const response = await fetch("/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        // Convertimos la respuesta del servidor en un objeto.
        const result = await response.json();

        // Comprobamos si el usuario se ha creado correctamente.
        if (response.ok) {
          alert(result.message);

          // Recargamos la página para actualizar la tabla.
          window.location.reload();
        } else {
          alert(result.message || "Error al crear el usuario");
        }
      } catch (error) {
        console.error("Error al crear el usuario:", error);
        alert("No se ha podido conectar con el servidor");
      }
    });
  }

  // ==========================================
  // EDITAR USUARIO
  // ==========================================

  // Ocultamos inicialmente el formulario de edición.
  if (editUserSection) {
    editUserSection.style.display = "none";
  }

  // Recuperamos los botones de editar usuario.
  const editUserButtons = document.querySelectorAll(".edit-user");

  // Recorremos los botones de edición.
  editUserButtons.forEach((button) => {
    // Escuchamos el clic sobre cada botón.
    button.addEventListener("click", () => {
      // Recuperamos la fila del usuario seleccionado.
      const row = button.closest("tr");

      // Recuperamos los datos del usuario.
      const userId = button.dataset.userId;
      const username = row.cells[1].textContent;
      const email = row.cells[2].textContent;
      const role = row.cells[3].textContent;

      // Introducimos los datos en el formulario.
      document.querySelector("#edit-user-id").value = userId;
      document.querySelector("#edit-username").value = username;
      document.querySelector("#edit-email").value = email;
      document.querySelector("#edit-role").value = role;

      // Mostramos el formulario de edición.
      editUserSection.style.display = "block";
    });
  });

  // Escuchamos el envío del formulario de edición.
  if (editUserForm) {
    editUserForm.addEventListener("submit", async (event) => {
      // Evitamos que el navegador recargue la página.
      event.preventDefault();

      // Recuperamos los datos del formulario.
      const formData = new FormData(editUserForm);

      // Convertimos los datos en un objeto JavaScript.
      const userData = Object.fromEntries(formData.entries());

      // Recuperamos el ID del usuario.
      const userId = userData.id;

      // Eliminamos el ID del objeto que enviaremos.
      delete userData.id;

      try {
        // Enviamos los datos para actualizar el usuario.
        const response = await fetch(`/api/user/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        // Convertimos la respuesta del servidor.
        const result = await response.json();

        // Comprobamos si la actualización ha funcionado.
        if (response.ok) {
          alert("Usuario actualizado correctamente");

          // Recargamos la página para mostrar los cambios.
          window.location.reload();
        } else {
          alert(result.message || "Error al actualizar el usuario");
        }
      } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        alert("No se ha podido conectar con el servidor");
      }
    });
  }

  // Cancelamos la edición del usuario.
  if (cancelEditButton) {
    cancelEditButton.addEventListener("click", () => {
      // Limpiamos los campos del formulario.
      editUserForm.reset();

      // Ocultamos el formulario de edición.
      editUserSection.style.display = "none";
    });
  }

  // ==========================================
  // ELIMINAR USUARIO
  // ==========================================

  // Recuperamos los botones de eliminar usuario.
  const deleteUserButtons = document.querySelectorAll(".delete-user");

  // Recorremos los botones de eliminación.
  deleteUserButtons.forEach((button) => {
    // Escuchamos el clic sobre cada botón.
    button.addEventListener("click", async () => {
      // Recuperamos el ID del usuario seleccionado.
      const userId = button.dataset.userId;

      // Pedimos confirmación antes de eliminarlo.
      const confirmar = confirm("¿Seguro que quieres eliminar este usuario?");

      // Si el usuario cancela, detenemos la operación.
      if (!confirmar) {
        return;
      }

      try {
        // Enviamos la petición para eliminar el usuario.
        const response = await fetch(`/api/user/${userId}`, {
          method: "DELETE",
        });

        // Convertimos la respuesta del servidor.
        const result = await response.json();

        // Comprobamos si la eliminación ha funcionado.
        if (response.ok) {
          alert(result.message);

          // Recargamos la página para actualizar la tabla.
          window.location.reload();
        } else {
          alert(result.message || "Error al eliminar el usuario");
        }
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        alert("No se ha podido conectar con el servidor");
      }
    });
  });
});
