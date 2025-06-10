import { getContactsByUserId, blockContact } from "../services/contact.service";

export async function setupNouvelleDiscussionEvents() {
  const contactsContainer = document.getElementById("contacts-list");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  if (!currentUser || !currentUser.id) {
    console.error("Aucun utilisateur connecté ou ID manquant");
    window.location.href = "./login.views.html";
    return;
  }

  if (!contactsContainer) return;

  try {
    const contacts = await getContactsByUserId(currentUser.id);

    const contactsHTML = contacts
      .map(
        (contact) => `
          <div class="contact-item flex items-center justify-between py-3 px-4 cursor-pointer hover:bg-gray-800"
               data-contact-id="${contact.id}">
            <div class="flex items-center">
              <div class="w-12 h-12 rounded-full bg-black flex-shrink-0 mr-3 overflow-hidden">
                <div class="w-full h-full bg-gradient-to-brfrom-purple-400 to-purple-600 flex justify-center items-center font-bold">
                  ${contact.prenom.charAt(0).toUpperCase()}${contact.nom
          .charAt(0)
          .toUpperCase()}
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-white text-base">${contact.prenom} ${
          contact.nom
        }</div>
                <div class="text-gray-400 text-sm">${contact.telephone}</div>
              </div>
            </div>
           
          </div>
        `
      )
      .join("");

    contactsContainer.innerHTML = contactsHTML;

    const contactItems = contactsContainer.querySelectorAll(".contact-item");

    contactItems.forEach((item, index) => {
      item.addEventListener("click", (e) => {
        if (e.target.classList.contains("block-btn")) return;

        const selectedContact = contacts[index];
        document.getElementById(
          "contactName"
        ).textContent = `${selectedContact.prenom} ${selectedContact.nom}`;
      });
    });

    const blockButtons = contactsContainer.querySelectorAll(".block-btn");

    blockButtons.forEach((button, index) => {
      button.addEventListener("click", async (e) => {
        e.stopPropagation();
        const contactId = button.dataset.contactId;
        const contact = contacts[index];

        if (
          confirm(
            `Voulez-vous vraiment bloquer ${contact.prenom} ${contact.nom} ?`
          )
        ) {
          try {
            await blockContact(currentUser.id, contactId);

            button.textContent = "Bloqué";
            button.classList.remove("bg-red-600", "hover:bg-red-700");
            button.classList.add("bg-gray-600", "cursor-default");
            button.disabled = true;

            setTimeout(() => {
              button.closest(".contact-item").remove();
            }, 1000);

            console.log(`${contact.prenom} ${contact.nom} a été bloqué`);
          } catch (error) {
            console.error("Erreur lors du blocage du contact:", error);
            alert("Une erreur est survenue lors du blocage du contact");
          }
        }
      });
    });
  } catch (error) {
    console.error("Erreur lors du chargement des contacts:", error);
    contactsContainer.innerHTML = `
      <div class="text-red-500 p-4">
        Erreur lors du chargement des contacts. Veuillez réessayer.
      </div>
    `;
  }
}
