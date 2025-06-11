import { setupContactEvents } from "./contact.controller.js";
import { setupNouvelleDiscussionEvents } from "./nouvelle.discussion.controller.js";
import {
  getContacts,
  getContactById,
  blockContact,
  getBlockedContacts,
  unblockContact,
} from "../services/contact.service.js";

let selectedContactId = null;

export function setupPanelEvents() {
  document.addEventListener("click", async (event) => {
    const plusButton = event.target.closest("#plus");
    if (plusButton) {
      const panel = document.getElementById("panel");
      if (panel) {
        fetch("./views/pages/nouvelle.discussion.html")
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

        pup.querySelector(".info-btn")?.addEventListener("click", async () => {
          if (!selectedContactId) {
            alert("Veuillez sélectionner un contact");
            return;
          }
          try {
            const contact = await getContactById(selectedContactId);
            const infoHTML = `
             
              <div id="reurnInfo" class="contact-info-modal">
                <span  class="ml-[90%] font-bold text-red-600 cursor-pointer">x <span>
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

    const reurnInfo = event.target.closest("#reurnInfo");
    if (reurnInfo) {
      document.getElementById("reurnInfo").addEventListener("click", () => {
        reurnInfo.style.display = "none";
      });
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

    const backnewgroupe = event.target.closest("#backnewgroupe");
    if (backnewgroupe) {
      const panel = document.getElementById("panel");
      if (panel) {
        fetch("/views/pages/nouvelle.discussion.html")
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

    const paramsBtn = event.target.closest("#paramsBtn");
    if (paramsBtn) {
      const panel = document.getElementById("panel");
      if (panel) {
        fetch("/views/components/params.html")
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

    const confback = event.target.closest("#confback");
    if (confback) {
      const panel = document.getElementById("panel");
      if (panel) {
        fetch("/views/components/params.html")
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

    const blockback = event.target.closest("#blockback");
    if (blockback) {
      const panel = document.getElementById("panel");
      if (panel) {
        fetch("/views/components/bloquerListe.html")
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

    const contactBlocked = event.target.closest("#contactBlocked");
    if (contactBlocked) {
      const panel = document.getElementById("panel");
      if (panel) {
        fetch("/views/components/bloquerListe.html")
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

    const newgroup = event.target.closest("#newgroup");
    if (newgroup) {
      const panel = document.getElementById("panel");
      if (panel) {
        fetch("/views/pages/nouveau.groupe.html")
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

    const debloque = event.target.closest("#debloque");
    if (debloque) {
      document.getElementById("debloque").innerHTML = confirm(
        "voulez vous debloquer ce contact"
      );
    }

    const listedescontactbloquer = event.target.closest(
      "#listedescontactbloquer"
    );
    if (listedescontactbloquer) {
      const panel = document.getElementById("panel");
      if (panel) {
        fetch("/views/components/listecontactbloquer.html")
          .then((response) => {
            if (!response.ok) {
              throw new Error("Erreur lors du chargement de la page");
            }
            return response.text();
          })
          .then((html) => {
            panel.innerHTML = html;
            displayBlockedContacts();
          })
          .catch((error) => {
            console.error("Erreur :", error);
          });
      }
    }

    // document.getElementById(
    //   "contactName"
    // ).textContent = `${selectedContact.prenom} ${selectedContact.nom}`;
    // selectedContactId = selectedContact.id;
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
      document.querySelectorAll(".contact-item").forEach((item) => {
        item.classList.remove("selected");
      });

      contactItem.classList.add("selected");
      selectedContactId = contactItem.dataset.contactId;

      try {
        const contact = await getContactById(selectedContactId);

        document.getElementById(
          "contactName"
        ).textContent = `${contact.prenom} ${contact.nom}`;
      } catch (error) {
        console.error("Erreur:", error);
      }
    }
  });
}

async function displayBlockedContacts() {
  const blockedContactsList = document.getElementById("blocked-contacts-list");
  if (!blockedContactsList) return;

  try {
    const blockedContacts = await getBlockedContacts();

    if (blockedContacts.length === 0) {
      blockedContactsList.innerHTML = `
        <div class="p-4 text-center text-gray-400">
          Aucun contact bloqué
        </div>
      `;
      return;
    }

    const contactsHTML = blockedContacts

      .map(
        (contact) => `
        <div class="flex items-center justify-between p-4 hover:bg-gray-800" data-contact-id="${contact.id}">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white">
              ${contact.prenom[0]}${contact.nom[0]}
            </div>
            <div>
              <h3 class="text-white font-medium">${contact.prenom} ${contact.nom}</h3>
              <p class="text-gray-400 text-sm">${contact.telephone}</p>
            </div>
          </div>
         
          <i class="fa-solid fa-xmark unblock-btn font-extrabold cursor-pointer  text-green-600"></i>
        </div>
      `
      )
      .join("");

    blockedContactsList.innerHTML = contactsHTML;

    document.querySelectorAll(".unblock-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const contactDiv = e.target.closest("[data-contact-id]");
        const contactId = contactDiv.dataset.contactId;

        try {
          await unblockContact(contactId);
          contactDiv.remove();

          if (blockedContactsList.children.length === 0) {
            blockedContactsList.innerHTML = `
              <div class="p-4 text-center text-gray-400">
                Aucun contact bloqué
              </div>
            `;
          }
        } catch (error) {
          console.error("Erreur lors du déblocage:", error);
          alert("Erreur lors du déblocage du contact");
        }
      });
    });
  } catch (error) {
    console.error("Erreur lors du chargement des contacts bloqués:", error);
    blockedContactsList.innerHTML = `
      <div class="p-4 text-center text-red-500">
        Erreur lors du chargement des contacts bloqués
      </div>
    `;
  }
}
