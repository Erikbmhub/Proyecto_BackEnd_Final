document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    if (!form) return;

    const generalErrorEl = document.getElementById("form-general-error");
    const errorSlots = Array.from(form.querySelectorAll("[data-error-for]"));

    function resetFieldVisual(fieldName) {
        const slot = form.querySelector(`[data-error-for="${fieldName}"]`);
        const input = form.querySelector(`[name="${fieldName}"]`);

        if (slot) {
            slot.textContent = "";
            slot.hidden = true;
        }

        if (input) {
            input.classList.remove("input-error");
            input.removeAttribute("aria-invalid");
        }
    }

    function clearAllErrors() {
        for (const slot of errorSlots) {
            resetFieldVisual(slot.dataset.errorFor);
        }

        if (generalErrorEl) {
            generalErrorEl.textContent = "";
            generalErrorEl.hidden = true;
        }
    }

    function renderFieldError(fieldName, messages) {
        const slot = form.querySelector(`[data-error-for="${fieldName}"]`);
        const input = form.querySelector(`[name="${fieldName}"]`);

        if (input) {
            input.classList.add("input-error");
            input.setAttribute("aria-invalid", "true");
        }

        if (slot) {
            slot.textContent = messages.join(" · ");
            slot.hidden = false;
            return true;
        }

        return false;
    }

    function showGeneralError(message) {
        if (!generalErrorEl) return;
        generalErrorEl.textContent = message;
        generalErrorEl.hidden = false;
    }

    form.addEventListener("input", (event) => {
        const target = event.target;
        if (target && target.name) {
            resetFieldVisual(target.name);
        }
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearAllErrors();

        const payload = Object.fromEntries(new FormData(form).entries());

        try {
            const response = await fetch(form.action, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
                body: JSON.stringify(payload),
                credentials: "include",
            });

            const contentType = response.headers.get("content-type") || "";
            const data = contentType.includes("application/json")
                ? await response.json()
                : { message: await response.text() };

            if (!response.ok) {
                if (Array.isArray(data.errors) && data.errors.length > 0) {
                    const groupedErrors = new Map();

                    for (const err of data.errors) {
                        const field = err.field || "_general";
                        if (!groupedErrors.has(field)) {
                            groupedErrors.set(field, []);
                        }
                        groupedErrors.get(field).push(err.message);
                    }

                    const unmatched = [];

                    for (const [field, msgs] of groupedErrors.entries()) {
                        const placedUnderInput = field !== "_general" && renderFieldError(field, msgs);
                        if (!placedUnderInput) {
                            unmatched.push(...msgs);
                        }
                    }

                    if (unmatched.length > 0) {
                        showGeneralError(unmatched.join(" · "));
                    }
                } else {
                    showGeneralError(data.message || "No se pudo iniciar sesión.");
                }
                return;
            }

            if (data.redirectTo) {
                window.location.href = data.redirectTo;
                return;
            }

            if (response.redirected && response.url) {
                window.location.href = response.url;
                return;
            }

            window.location.href = "/dashboard";
        } catch (error) {
            console.error("Error al enviar el formulario de login:", error);
            showGeneralError("Error de conexión con el servidor. Inténtalo de nuevo.");
        }
    });
});