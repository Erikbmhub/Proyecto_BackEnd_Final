document.addEventListener("click", async (event) => {
  const toggleButton = event.target.closest(".favorite-toggle");
  const listRemoveButton = event.target.closest(".remove-favorite:not(.favorite-toggle)");
  const button = toggleButton || listRemoveButton;

  if (!button) return;

  const isRemoving = toggleButton
    ? toggleButton.classList.contains("is-favorite")
    : Boolean(listRemoveButton);
  button.disabled = true;

  try {
    const response = isRemoving
      ? await fetch(`/api/favorites/${encodeURIComponent(button.dataset.tmdbId)}`, {
          method: "DELETE",
        })
      : await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tmdbId: button.dataset.tmdbId,
            title: button.dataset.title,
            image: button.dataset.image || "",
            year: button.dataset.year || "",
            description: button.dataset.description || "",
            imdbRating: button.dataset.rating ? Number(button.dataset.rating) : undefined,
          }),
        });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "No se pudo actualizar favoritos");

    if (toggleButton) {
      toggleButton.classList.toggle("is-favorite", !isRemoving);
      toggleButton.disabled = false;
      toggleButton.textContent = isRemoving ? "Añadir a favoritos" : "Eliminar de favoritos";
    } else {
      listRemoveButton.closest(".favorite-item").remove();
      if (!document.querySelector(".favorite-item")) {
        const section = document.querySelector(".favorites-container");
        section.insertAdjacentHTML("afterbegin", "<p>Aún no tienes películas favoritas.</p>");
      }
    }
  } catch (error) {
    window.alert(error.message);
    button.disabled = false;
  }
});
