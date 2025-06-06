import { loadView } from "../router.js";
import { setupAccueilEvents } from "./whatsapp.controller.js";

export function setupLoginEvents(telephoneParDefaut) {
  const form = document.getElementById("loginForm");
  const input = document.getElementById("telephone");
  const selectIndicatif = document.getElementById("countryCode");

  if (telephoneParDefaut && input) {
    input.value = telephoneParDefaut;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const indicatif = selectIndicatif ? selectIndicatif.value : "";
    const numero = input.value.trim();

    const telephone = indicatif + numero.replace(/\s+/g, "");

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (savedUser?.telephone === telephone) {
      loadView("/views/pages/whatsap.views.html", setupAccueilEvents);
    } else {
      alert("Numéro incorrect");
    }
  });
}
