export function loadView(viewPath, callback) {
  fetch(viewPath)
    .then((response) => response.text())
    .then((html) => {
      const app = document.getElementById("app");
      if (!app) {
        console.error("Conteneur #app introuvable.");
        return;
      }
      app.innerHTML = html;
      if (callback) callback();
    })
    .catch((error) => {
      console.error("Erreur lors du chargement de la vue :", error);
    });
}

export function redirectTo(viewPath, callback) {
  loadView(viewPath, callback);
}
