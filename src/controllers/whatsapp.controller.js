import { setupContactEvents } from "./contact.controller.js";

export function setupPanelEvents() {
  document.addEventListener("click", (event) => {
    // Vérifier si le clic est sur le bouton ou son icône
    const plusButton = event.target.closest("#plus");
    if (plusButton) {
      console.log("Bouton plus cliqué");
      const panel = document.getElementById("panel");
      if (panel) {
        fetch("/views/pages/nouvelle.discussion.html")
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
          })
          .then((html) => {
            panel.innerHTML = html;
            // Attention à ne pas perdre les événements après le changement de HTML
          })
          .catch((error) => {
            console.error("Erreur de chargement :", error);
          });
      }
    }

    const newContactButton = event.target.closest("#newContact");
    if (newContactButton) {
      const panel = document.getElementById("panel");
      if (panel) {
        fetch("/views/pages/newContact.view.html")
          .then((response) => {
            if (!response.ok) {
              throw new Error("Erreur lors du chargement de la page");
            }
            return response.text();
          })
          .then((html) => {
            panel.innerHTML = html;
            setupContactEvents(); // Initialise les événements après le chargement
          })
          .catch((error) => {
            console.error("Erreur :", error);
          });
      }
    }
  });
}

// Supprimer setupNewContactEvent car il est maintenant géré via la délégation
export function setupAccueilEvents() {
  document.addEventListener("click", (event) => {
    if (event.target.closest("#logoutBtn")) {
      localStorage.removeItem("user");
      location.reload();
    }
  });
}

export function setupSidebarEvents() {
  // ...existing code...

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // Supprimer les données de l'utilisateur du localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("contacts");

      // Rediriger vers la page de connexion
      window.location.href = "/views/pages/login.views.html";
    });
  }
}
