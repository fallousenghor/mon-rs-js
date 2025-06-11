import { getContactsByUserId } from "../services/contact.service.js";

async function displayUserContacts() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) return;

    const contacts = await getContactsByUserId(user.id);
    const contactsContainer = document.getElementById("contactsContainer");

    if (!contactsContainer) return;

    contactsContainer.innerHTML = "";

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

export { displayUserContacts };
