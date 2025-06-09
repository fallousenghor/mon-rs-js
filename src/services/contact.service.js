export async function ajouterContact(contactData) {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.id) {
      throw new Error("Utilisateur non connecté");
    }

    // Validation des données
    if (!contactData.prenom || !contactData.nom || !contactData.telephone) {
      throw new Error("Données de contact incomplètes");
    }

    // Vérification si le contact existe déjà
    const existingContacts = await getContactsByUserId(user.id);
    const contactExists = existingContacts.some(
      (c) => c.telephone === contactData.telephone
    );

    if (contactExists) {
      throw new Error("Ce contact existe déjà");
    }

    const contact = {
      prenom: contactData.prenom,
      nom: contactData.nom,
      telephone: contactData.telephone,
      userId: user.id,
      sync: contactData.sync ?? true,
      createdAt: new Date().toISOString(),
    };

    const response = await fetch("http://localhost:3000/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur création contact:", error);
    throw error; // Propagation de l'erreur spécifique
  }
}

export async function getContactsByUserId(userId) {
  try {
    const response = await fetch(
      `http://localhost:3000/contacts?userId=${userId}`
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur récupération contacts:", error);
    throw new Error("Impossible de récupérer les contacts");
  }
}
