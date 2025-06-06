export function loadView(viewPath, callback) {
  fetch(viewPath)
    .then((response) => response.text())
    .then((html) => {
      document.body.innerHTML = html;
      if (callback) callback();
    })
    .catch((error) => {
      console.error("Erreur lors du chargement de la vue :", error);
    });
}

export function redirectTo(viewPath, callback) {
  loadView(viewPath, callback);
}
