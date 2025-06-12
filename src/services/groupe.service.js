const BASE_URL = "https://backend-js-server-vrai.onrender.com/groupes";

async function fetchData(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }
  return await response.json();
}

export async function createGroupe(groupeData) {
  try {
    if (
      !groupeData.nom ||
      !groupeData.adminId ||
      !groupeData.membres ||
      groupeData.membres.length < 2
    ) {
      throw new Error("Données de groupe invalides");
    }

    const groupe = {
      ...groupeData,
      createdAt: new Date().toISOString(),
    };

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(groupe),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur création groupe:", error);
    throw error;
  }
}

export async function getGroupesByUserId(userId) {
  try {
    return await fetchData(`${BASE_URL}?adminId=${userId}`);
  } catch (error) {
    console.error("Erreur récupération groupes:", error);
    throw error;
  }
}
