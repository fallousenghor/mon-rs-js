import { loadView } from "../router.js";

export function setupPanelEvents() {
  const plusIcon = document.getElementById("icon-plus");
  if (plusIcon) {
    plusIcon.addEventListener("click", () => {
      const panel = document.getElementById("panel");
      if (panel) {
        fetch("/views/pages/nouvelle.discussion.html")
          .then((response) => {
            if (!response.ok)
              throw new Error("Erreur lors du chargement de la page");
            return response.text();
          })
          .then((html) => {
            panel.innerHTML = html;
            setupNewContactEvent(); // Ici on attend que #newContact existe dans le DOM
          })
          .catch((error) => {
            console.error("Erreur :", error);
          });
      }
    });
  }
}

export function setupNewContactEvent() {
  const newContact = document.getElementById("newContact");
  const panel = document.getElementById("panel");

  if (newContact && panel) {
    newContact.addEventListener("click", () => {
      fetch("/views/pages/newContact.view.html")
        .then((response) => {
          if (!response.ok)
            throw new Error("Erreur lors du chargement de la page");
          return response.text();
        })
        .then((html) => {
          panel.innerHTML = html;
          // Ici tu peux appeler un setup spécifique si besoin
        })
        .catch((error) => {
          console.error("Erreur :", error);
        });
    });
  }
}

export function setupAccueilEvents() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      location.reload();
    });
  }
}

// autres exports...
