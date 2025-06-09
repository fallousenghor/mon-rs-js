import { ajouterContact } from "../services/contact.service.js";

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
      // Amélioration de la vérification de l'authentification
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        throw new Error("Vous devez être connecté pour ajouter un contact");
      }

      let currentUser;
      try {
        currentUser = JSON.parse(userStr);
      } catch (e) {
        localStorage.removeItem("user"); // Nettoyage si les données sont corrompues
        throw new Error("Session invalide, veuillez vous reconnecter");
      }

      if (!currentUser || !currentUser.id) {
        localStorage.removeItem("user");
        throw new Error("Session invalide, veuillez vous reconnecter");
      }

      // Validation des champs
      const prenom = firstNameInput.value.trim();
      const nom = lastNameInput.value.trim();
      const indicatif = selectIndicatif.value;
      const numero = inputNumero.value.trim();

      if (!prenom || !nom || !numero) {
        throw new Error("Veuillez remplir tous les champs obligatoires");
      }

      // Validation du numéro de téléphone
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

      // Succès
      alert("Contact ajouté avec succès!");

      // Réinitialisation du formulaire
      firstNameInput.value = "";
      lastNameInput.value = "";
      inputNumero.value = "";
      selectIndicatif.selectedIndex = 0;
      sync = true;
      if (btnToggle.classList.contains("bg-gray-600")) {
        btnToggle.click(); // Réinitialiser le toggle
      }
    } catch (error) {
      // Affichage de l'erreur
      alert(error.message || "Erreur lors de l'ajout du contact");
      console.error("Erreur :", error);

      // Si l'erreur est liée à l'authentification, rediriger vers la page de connexion
      if (
        error.message.includes("connecté") ||
        error.message.includes("Session")
      ) {
        window.location.href = "/login.html";
      }
    }
  });
}
