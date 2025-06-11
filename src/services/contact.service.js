export async function ajouterContact(contactData) {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.id) {
      throw new Error("Utilisateur non connecté");
    }

    if (!contactData.prenom || !contactData.nom || !contactData.telephone) {
      throw new Error("Données de contact incomplètes");
    }

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
      blocked: false,
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
    throw error;
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

export async function getContacts() {
  const res = await fetch("http://localhost:3000/contacts");
  if (!res.ok) throw new Error("Erreur lors du chargement des contacts");
  return await res.json();
}

export async function getContactById(id) {
  const response = await fetch(`http://localhost:3000/contacts/${id}`);
  if (!response.ok) throw new Error("Contact non trouvé");
  return await response.json();
}

export async function blockContact(id) {
  const response = await fetch(`http://localhost:3000/contacts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ blocked: true }),
  });
  if (!response.ok) throw new Error("Échec du blocage du contact");
  return await response.json();
}

export async function getBlockedContacts() {
  const response = await fetch("http://localhost:3000/contacts?blocked=true");
  if (!response.ok)
    throw new Error("Erreur lors du chargement des contacts bloqués");
  return await response.json();
}

export async function unblockContact(id) {
  const response = await fetch(`http://localhost:3000/contacts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ blocked: false }),
  });
  if (!response.ok) throw new Error("Échec du déblocage du contact");
  return await response.json();
}
