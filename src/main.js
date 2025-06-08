import "./style.css";
import { loadView } from "./router.js";
import {
  setupPanelEvents,
  setupNewContactEvent,
} from "./controllers/whatsapp.controller.js";

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  loadView("/views/pages/register.views.html", async () => {
    try {
      const module = await import("./controllers/user.controller.js");
      module.setupFormEvents();
    } catch (error) {
      console.error("Erreur chargement du contrôleur register :", error);
    }
  });
} else {
  loadView("/views/pages/whatsap.views.html", () => {
    setTimeout(() => {
      setupPanelEvents();
    }, 0);
  });
}
