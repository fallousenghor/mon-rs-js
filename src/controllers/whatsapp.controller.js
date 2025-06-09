import { setupContactEvents } from "./contact.controller.js";
import { setupNouvelleDiscussionEvents } from "./nouvelle.discussion.controller.js";

export function setupPanelEvents() {
  document.addEventListener("click", (event) => {
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
            setupNouvelleDiscussionEvents();
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
            setupContactEvents();
          })
          .catch((error) => {
            console.error("Erreur :", error);
          });
      }
    }
  });
}

export function setupAccueilEvents() {
  document.addEventListener("click", (event) => {
    if (event.target.closest("#logoutBtn")) {
      localStorage.removeItem("user");
      location.reload();
    }
  });
}

export function setupSidebarEvents() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      localStorage.removeItem("contacts");
      window.location.href = "/views/pages/login.views.html";
    });
  }
}
