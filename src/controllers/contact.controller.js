document
  .getElementById("form-contact")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const contact = {
      prenom: document.getElementById("prenom").value,
      nom: document.getElementById("nom").value,
      telephone: document.getElementById("telephone").value,
      utilisateurId: userId, // Associe le contact à l'utilisateur connecté
    };

    fetch("http://localhost:3000/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Contact ajouté avec succès !");
        // éventuellement recharger ou mettre à jour la liste
      })
      .catch((err) => console.error("Erreur ajout contact :", err));
  });
