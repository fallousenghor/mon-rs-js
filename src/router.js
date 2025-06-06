export function loadView(viewPath, callback) {
  fetch(viewPath)
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("app").innerHTML = html;
      if (typeof callback === "function") callback();
    })
    .catch((err) => console.error("Erreur fetch:", err));
}
