const getAllNieuwsberichten = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nieuwsberichten`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("Nieuwsberichten ophalen mislukt.");
    }
    return response.json();
}

const addNieuwsbericht = async (titel: string, inhoud: string, datum: Date, auteur: string) => {
  const token = JSON.parse(sessionStorage.getItem("loggedInUser") || "{}").token;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nieuwsberichten`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
          titel,
          inhoud,
          datum,
          auteur
      }),
  });
  if (!response.ok) {
      throw new Error("Nieuwsbericht toevoegen mislukt.");
  }
  return response.json();
};

const updateNieuwsbericht = async (id: number, titel: string, inhoud: string, datum: Date, auteur: string) => {
  const token = JSON.parse(sessionStorage.getItem("loggedInUser") || "{}").token;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nieuwsberichten`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
          id,
          titel,
          inhoud,
          datum,
          auteur
      }),
  });
  if (!response.ok) {
      throw new Error("Nieuwsbericht bijwerken mislukt.");
  }
  return response.json();
};

const deleteNieuwsbericht = async (id: number) => {
  const token = JSON.parse(sessionStorage.getItem("loggedInUser") || "{}").token;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nieuwsberichten/${id}`, {
      method: "DELETE",
      headers: {
          "Authorization": `Bearer ${token}`
      }
  });
  if (!response.ok) {
      throw new Error("Nieuwsbericht verwijderen mislukt.");
  }
};

const NieuwsberichtService = {
  getAllNieuwsberichten,
  addNieuwsbericht,
  updateNieuwsbericht,
  deleteNieuwsbericht,
};

export default NieuwsberichtService;