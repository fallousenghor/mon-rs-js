import { setupContactEvents } from "./contact.controller.js";
import { setupNouvelleDiscussionEvents } from "./nouvelle.discussion.controller.js";
import {
  getContacts,
  getContactById,
  blockContact,
  getBlockedContacts,
  unblockContact,
} from "../services/contact.service.js";
import { updateContactsList } from "../utils/utils.js";
import { templates } from "../../public/views/components/template.js";

let selectedContactId = null;

async function loadTemplate(url, panelId = "panel", setupFunction = null) {
  try {
    const panel = document.getElementById(panelId);
    if (!panel) return;

    const response = await fetch(url);
    const html = await response.text();
    panel.innerHTML = html;

    if (setupFunction) {
      setupFunction();
    }
  } catch (error) {
    console.error(`Erreur de chargement (${url}):`, error);
  }
}

async function showContactInfo(contact) {
  const modal = document.createElement("div");
  modal.classList = "mod";
  modal.innerHTML = templates.contactInfo(contact);
  document.body.appendChild(modal);

  modal.querySelector(".close-btn").addEventListener("click", () => {
    modal.remove();
  });
}

export async function setupPanelEvents() {
  document.addEventListener("click", async (event) => {
    const pup = document.getElementById("pup");

    const buttonHandlers = {
      "#plus": "/views/pages/nouvelle.discussion.html",
      "#retourbtn": "/views/pages/nouvelle.discussion.html",
      "#newContact": "/views/pages/newContact.view.html",
      "#backnewgroupe": "/views/pages/nouvelle.discussion.html",
      "#paramsBtn": "/views/components/params.html",
      "#confback": "/views/components/params.html",
      "#blockback": "/views/components/bloquerListe.html",
      "#contactBlocked": "/views/components/bloquerListe.html",
      "#newgroup": "/views/pages/nouveau.groupe.html",
      "#listedescontactbloquer": "/views/components/listecontactbloquer.html",
    };

    for (const [selector, url] of Object.entries(buttonHandlers)) {
      if (event.target.closest(selector)) {
        const setupFn =
          selector === "#plus" || selector === "#retourbtn"
            ? setupNouvelleDiscussionEvents
            : setupContactEvents;

        if (selector === "#listedescontactbloquer") {
          await loadTemplate(url, "panel", displayBlockedContacts);
        } else {
          await loadTemplate(url, "panel", setupFn);
        }
        return;
      }
    }

    const menupopup = event.target.closest("#menupopup");
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
            showContactInfo(contact);
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
            const contactElement = document.querySelector(
              `[data-contact-id="${selectedContactId}"]`
            );
            if (contactElement) contactElement.remove();
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

    const debloque = event.target.closest("#debloque");
    if (debloque) {
      const confirmed = confirm("Voulez-vous débloquer ce contact ?");
      if (confirmed) {
      }
    }

    const reurnInfo = event.target.closest("#reurnInfo .close-btn");
    if (reurnInfo) {
      reurnInfo.closest("#reurnInfo").remove();
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

export function setupContactSelection() {
  document.addEventListener("click", async (event) => {
    const contactItem = event.target.closest(".contact-item");
    if (contactItem) {
      document
        .querySelectorAll(".contact-item")
        .forEach((item) => item.classList.remove("selected"));
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
    blockedContactsList.innerHTML =
      templates.blockedContactsList(blockedContacts);

    blockedContactsList.addEventListener("click", async (e) => {
      const unblockBtn = e.target.closest(".unblock-btn");
      if (!unblockBtn) return;

      const contactItem = unblockBtn.closest(".blocked-contact-item");
      const contactId = contactItem?.dataset.contactId;
      if (!contactId) return;

      try {
        await unblockContact(contactId);
        contactItem.remove();

        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (currentUser?.id) {
          const contacts = await getContacts(currentUser.id);
          updateContactsList(contacts);
        }

        if (blockedContactsList.children.length === 0) {
          blockedContactsList.innerHTML = templates.blockedContactsList([]);
        }
      } catch (error) {
        console.error("Erreur lors du déblocage:", error);
        alert("Erreur lors du déblocage du contact");
      }
    });
  } catch (error) {
    console.error("Erreur lors du chargement des contacts bloqués:", error);
    blockedContactsList.innerHTML = templates.blockedContactsError;
  }
}
