const BASE_URL = "https://backend-js-server-vrai.onrender.com/utilisateurs";

export async function createUser(user) {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Correction de la casse
      },
      body: JSON.stringify(user),
    });

    if (!res.ok) {
      throw new Error(`Erreur HTTP: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    throw error;
  }
}

export async function getUserByTelephone(telephone) {
  try {
    const res = await fetch(
      `${BASE_URL}?telephone=${encodeURIComponent(telephone)}`
    );

    if (!res.ok) {
      throw new Error(`Erreur HTTP: ${res.status}`);
    }

    const users = await res.json();
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error("Erreur lors de la vérification du numéro:", error);
    throw error;
  }
}
