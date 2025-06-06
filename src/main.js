import "./style.css";
import "./validators/validation.js";
import { loadView } from "./router.js";
import { setupFormEvents } from "./controllers/user.controller.js";

loadView("/views/pages/register.views.html", setupFormEvents);
