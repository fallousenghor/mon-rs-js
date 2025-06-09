import { getContactsByUserId } from "../services/contact.service";

export async function setupNouvelleDiscussionEvents() {
  const contactsContainer = document.getElementById("contacts-list");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Afficher les informations de debug
  console.log("Current user from localStorage:", currentUser);

  // Vérification plus robuste de l'utilisateur connecté
  if (!currentUser || !currentUser.id) {
    console.error("Aucun utilisateur connecté ou ID manquant");
    window.location.href = "/views/pages/login.views.html";
    return;
  }

  if (!contactsContainer) return;

  try {
    const contacts = await getContactsByUserId(currentUser.id);

    const contactsHTML = contacts
      .map(
        (contact) => `
            <div class="flex items-center py-3 cursor-pointer hover:bg-gray-800">
                <div class="w-12 h-12 rounded-full bg-purple-500 flex-shrink-0 mr-3 overflow-hidden">
                    <div class="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600"></div>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="text-white text-base">${contact.prenom} ${contact.nom}</div>
                    <div class="text-gray-400 text-sm">${contact.telephone}</div>
                </div>
            </div>
        `
      )
      .join("");

    contactsContainer.innerHTML = contactsHTML;

    // Ajouter les écouteurs d'événements pour chaque contact
    const contactElements =
      contactsContainer.querySelectorAll(".flex.items-center");
    contactElements.forEach((element) => {
      element.addEventListener("click", () => {
        // Logique pour démarrer une nouvelle discussion
        console.log(
          "Démarrer une discussion avec:",
          element.querySelector(".text-white").textContent
        );
      });
    });
  } catch (error) {
    console.error("Erreur lors du chargement des contacts:", error);
  }
}
