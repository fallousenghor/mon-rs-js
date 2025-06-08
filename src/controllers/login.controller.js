import { redirectTo, loadView } from "../router.js";
import { setupAccueilEvents } from "./whatsapp.controller.js";
import { showError } from "../utils/utils.js";
import { validatePhoneNumber } from "../validators/validators.js";
import { getUserByTelephone } from "../services/user.service.js";

// Variables pour stocker temporairement les infos de vérification
let currentVerificationCode = null;
let currentPhoneNumber = null;

/**
 * Initialise les événements du formulaire de connexion
 */
export function setupLoginEvents(telephoneParDefaut) {
  const form = document.getElementById("loginForm");
  const input = document.getElementById("telephone");
  const selectIndicatif = document.getElementById("countryCode");
  const redirectToLoginLink = document.getElementById("goToRegister");

  if (!form || !input || !selectIndicatif) return;

  if (telephoneParDefaut) {
    input.value = telephoneParDefaut;
  }

  // Soumission du formulaire de connexion
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const phoneNumberRaw = input.value.trim();
    const validationError = validatePhoneNumber(phoneNumberRaw);

    if (validationError) {
      showError(validationError);
      return;
    }

    try {
      const indicatif = selectIndicatif.value;
      const numero = phoneNumberRaw.replace(/\s+/g, "");
      const telephone = indicatif + numero;

      const user = await getUserByTelephone(telephone);

      if (!user) {
        showError("Numéro de téléphone introuvable.");
        return;
      }

      // ✅ Générer un code de vérification à 4 chiffres
      currentVerificationCode = Math.floor(
        1000 + Math.random() * 9000
      ).toString();
      currentPhoneNumber = telephone;

      // ✅ Simuler l'envoi du code par SMS (à remplacer par une vraie API SMS plus tard)
      alert(`Code de vérification envoyé : ${currentVerificationCode}`);

      // ✅ Charger la vue de vérification du code
      loadView("/views/pages/verification.view.html", () => {
        setupVerificationEvents(); // Initialise le formulaire de vérification
      });
    } catch (error) {
      console.error(error);
      showError("Une erreur est survenue.");
    }
  });

  // Redirection vers la page d'inscription
  if (redirectToLoginLink) {
    redirectToLoginLink.addEventListener("click", (e) => {
      e.preventDefault();
      loadView("/views/pages/register.views.html");
    });
  }
}

function setupVerificationEvents() {
  const form = document.getElementById("verificationForm");
  const inputs = [
    document.getElementById("code1"),
    document.getElementById("code2"),
    document.getElementById("code3"),
    document.getElementById("code4"),
  ];

  if (!form || inputs.some((input) => !input)) return;

  // Passage automatique au champ suivant
  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      if (input.value.length === 1 && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const codeSaisi = inputs.map((input) => input.value.trim()).join("");

    if (codeSaisi === currentVerificationCode) {
      loadView("/views/pages/whatsap.views.html", setupAccueilEvents);
    } else {
      showError("Code de vérification incorrect. Veuillez réessayer.");
    }
  });
}
