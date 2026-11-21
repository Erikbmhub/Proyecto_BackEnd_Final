document.addEventListener("click", async (event) => {
  const addButton = event.target.closest(".favorite-toggle");
  const removeButton = event.target.closest(".remove-favorite");

  if (!addButton && !removeButton) return;

  const button = addButton || removeButton;
  button.disabled = true;

  try {
    let response;
    if (addButton) {
      const data = addButton.dataset;
      response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdbId: data.tmdbId,
          title: data.title,
          image: data.image || "",
          year: data.year || "",
          description: data.description || "",
          imdbRating: data.rating ? Number(data.rating) : undefined,
        }),
      });
    } else {
      response = await fetch(`/api/favorites/${encodeURIComponent(removeButton.dataset.tmdbId)}`, {
        method: "DELETE",
      });
    }

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "No se pudo actualizar favoritos");

    if (addButton) {
      addButton.textContent = "En favoritos";
    } else {
      removeButton.closest(".favorite-item").remove();
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
