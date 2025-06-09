import {
  ajouterContact,
  getContactsByUserId,
} from "../services/contact.service.js";

async function displayUserContacts() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) return;

    const contacts = await getContactsByUserId(user.id);
    const contactsContainer = document.getElementById("contactsContainer");

    if (!contactsContainer) return;

    contactsContainer.innerHTML = "";

    // Ajouter le contact de l'utilisateur lui-même en premier
    const userContactHtml = `
      <div class="flex items-center py-3 hover:bg-gray-700 cursor-pointer">
        <div class="w-12 h-12 rounded-full bg-purple-500 flex-shrink-0 mr-3 overflow-hidden">
          <div class="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">
            ${user.prenom ? user.prenom.charAt(0) : ""}${
      user.nom ? user.nom.charAt(0) : ""
    }
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-white text-base">${user.telephone} (vous)</div>
          <div class="text-gray-400 text-sm">Envoyez-vous un message</div>
        </div>
      </div>
      <div class="border-b border-gray-700 my-2"></div>
    `;
    contactsContainer.innerHTML += userContactHtml;

    // Ajouter les autres contacts
    contacts.forEach((contact) => {
      const contactHtml = `
        <div class="flex items-center py-3 hover:bg-gray-700 cursor-pointer">
          <div class="w-12 h-12 rounded-full bg-gray-600 flex-shrink-0 mr-3 overflow-hidden">
            <div class="w-full h-full flex items-center justify-center text-white font-bold bg-gradient-to-br from-blue-400 to-blue-600">
              ${contact.prenom.charAt(0)}${contact.nom.charAt(0)}
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-white text-base">${contact.prenom} ${
        contact.nom
      }</div>
            <div class="text-gray-400 text-sm">${contact.telephone}</div>
          </div>
        </div>
      `;
      contactsContainer.innerHTML += contactHtml;
    });
  } catch (error) {
    console.error("Erreur affichage contacts:", error);
  }
}

export function setupContactEvents() {
  const form = document.querySelector("form");
  const btnAjout = document.getElementById("addContactBtn");
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const selectIndicatif = document.querySelector("select");
  const inputNumero = document.querySelector('input[type="tel"]');
  const btnToggle = document.getElementById("toggleSwitch");

  if (
    !btnAjout ||
    !firstNameInput ||
    !lastNameInput ||
    !selectIndicatif ||
    !inputNumero
  ) {
    console.error("Éléments manquants dans le DOM");
    return;
  }

  let sync = true;

  btnToggle?.addEventListener("click", () => {
    sync = !sync;
  });

  btnAjout.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        throw new Error("Vous devez être connecté pour ajouter un contact");
      }

      let currentUser;
      try {
        currentUser = JSON.parse(userStr);
      } catch (e) {
        localStorage.removeItem("user");
        throw new Error("Session invalide, veuillez vous reconnecter");
      }

      if (!currentUser || !currentUser.id) {
        localStorage.removeItem("user");
        throw new Error("Session invalide, veuillez vous reconnecter");
      }

      const prenom = firstNameInput.value.trim();
      const nom = lastNameInput.value.trim();
      const indicatif = selectIndicatif.value;
      const numero = inputNumero.value.trim();

      if (!prenom || !nom || !numero) {
        throw new Error("Veuillez remplir tous les champs obligatoires");
      }

      if (!/^\d{6,}$/.test(numero)) {
        throw new Error("Le numéro de téléphone n'est pas valide");
      }

      const telephone = indicatif + numero;

      const nouveauContact = {
        prenom,
        nom,
        telephone,
        sync,
        userId: currentUser.id,
      };

      const contactAjoute = await ajouterContact(nouveauContact);

      alert("Contact ajouté avec succès!");
      await displayUserContacts();

      firstNameInput.value = "";
      lastNameInput.value = "";
      inputNumero.value = "";
      selectIndicatif.selectedIndex = 0;
      sync = true;
      if (btnToggle.classList.contains("bg-gray-600")) {
        btnToggle.click();
      }
    } catch (error) {
      alert(error.message || "Erreur lors de l'ajout du contact");
      console.error("Erreur :", error);

      if (
        error.message.includes("connecté") ||
        error.message.includes("Session")
      ) {
        window.location.href = "/login.html";
      }
    }
  });

  // Afficher les contacts au chargement
  displayUserContacts();
}
