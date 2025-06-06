import { loadView } from "../router.js";
import { setupAccueilEvents } from "./whatsapp.controller.js";
import { showError } from "../utils/utils.js";
import { validatePhoneNumber } from "../validators/validators.js";
import { getUserByTelephone } from "../services/user.service.js";

export function setupLoginEvents(telephoneParDefaut) {
  const form = document.getElementById("loginForm");
  const input = document.getElementById("telephone");
  const selectIndicatif = document.getElementById("countryCode");
  const redirectToLoginLink = document.getElementById("redirectToLogin"); // ID du lien "Se connecter"

  if (telephoneParDefaut && input) {
    input.value = telephoneParDefaut;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const phoneNumber = input.value.trim();
    const validationError = validatePhoneNumber(phoneNumber);

    if (validationError) {
      showError(validationError);
      return;
    }

    try {
      const indicatif = selectIndicatif ? selectIndicatif.value : "";
      const numero = input.value.trim();

      const telephone = indicatif + numero.replace(/\s+/g, "");

      const user = await getUserByTelephone(telephone);
      if (!user) {
        showError("Numéro de téléphone introuvable.");
      } else {
        // Redirection ou autre logique
        loadView("/views/pages/whatsap.views.html", setupAccueilEvents);
      }
    } catch (error) {
      console.error(error);
      showError("Une erreur est survenue.");
    }
  });

  // Gestion du clic sur "Se connecter"
  if (redirectToLoginLink) {
    redirectToLoginLink.addEventListener("click", (e) => {
      e.preventDefault();
      loadView("/views/pages/login.views.html"); // Redirection vers la page de connexion
    });
  }
}
