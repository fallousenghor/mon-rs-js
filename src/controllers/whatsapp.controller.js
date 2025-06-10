import { setupContactEvents } from "./contact.controller.js";
import { setupNouvelleDiscussionEvents } from "./nouvelle.discussion.controller.js";
import {
  getContacts,
  getContactById,
  blockContact,
} from "../services/contact.service.js";

let selectedContactId = null; // Ajoute ceci en haut du fichier

export function setupPanelEvents() {
  document.addEventListener("click", async (event) => {
    const plusButton = event.target.closest("#plus");
    if (plusButton) {
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

    // const bloquer = event.target.closest("#bloquer");
    // if (bloquer) {
    //   const bloquer = document.getElementById("bloquer");
    //   bloquer.style.color = "red";
    // }

    const retourbtn = event.target.closest("#retourbtn");
    if (retourbtn) {
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

    const menupopup = event.target.closest("#menupopup");
    const pup = document.getElementById("pup");

    if (menupopup) {
      try {
        const response = await fetch("/views/components/popup.html");
        const html = await response.text();
        pup.innerHTML = html;
        pup.style.display = "block";

        // Gérer les clics sur les options du popup
        pup.querySelector(".info-btn")?.addEventListener("click", async () => {
          if (!selectedContactId) {
            alert("Veuillez sélectionner un contact");
            return;
          }
          try {
            const contact = await getContactById(selectedContactId);
            const infoHTML = `
              <div class="contact-info-modal">
                <h3>Informations du contact</h3>
                <p>Nom: ${contact.nom}</p>
                <p>Prénom: ${contact.prenom}</p>
                <p>Téléphone: ${contact.telephone}</p>
                <p>Statut: ${contact.blocked ? "Bloqué" : "Actif"}</p>
              </div>
            `;
            const modal = document.createElement("div");
            modal.innerHTML = infoHTML;
            document.body.appendChild(modal);
            pup.style.display = "none";
          } catch (error) {
            alert("Erreur lors de la récupération des informations");
            console.error(error);
          }
        });

        pup.querySelector(".block-btn")?.addEventListener("click", async () => {
          if (!selectedContactId) {
            alert("Veuillez sélectionner un contact");
            return;
          }
          try {
            await blockContact(selectedContactId);
            alert("Contact bloqué avec succès");
            pup.style.display = "none";
          } catch (error) {
            alert("Erreur lors du blocage du contact");
            console.error(error);
          }
        });
      } catch (error) {
        console.error("Erreur lors du chargement du popup:", error);
      }
    } else if (!event.target.closest("#pup")) {
      pup.style.display = "none";
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

    // Quand un contact est sélectionné (ex: dans setupNouvelleDiscussionEvents)
    document.getElementById(
      "contactName"
    ).textContent = `${selectedContact.prenom} ${selectedContact.nom}`;
    selectedContactId = selectedContact.id; // Ajoute cette ligne
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

export function setupContactSelection() {
  document.addEventListener("click", async (event) => {
    const contactItem = event.target.closest(".contact-item");
    if (contactItem) {
      // Retire la sélection précédente
      document.querySelectorAll(".contact-item").forEach((item) => {
        item.classList.remove("selected");
      });

      // Ajoute la sélection au contact cliqué
      contactItem.classList.add("selected");
      selectedContactId = contactItem.dataset.contactId;

      try {
        const contact = await getContactById(selectedContactId);
        // Met à jour l'affichage du contact sélectionné
        document.getElementById(
          "contactName"
        ).textContent = `${contact.prenom} ${contact.nom}`;
      } catch (error) {
        console.error("Erreur:", error);
      }
    }
  });
}
