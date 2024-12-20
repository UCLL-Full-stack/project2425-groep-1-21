const getLeiding = async () => {
  const token = JSON.parse(sessionStorage.getItem("loggedInUser") || "{}").token;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leiding`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",
      "Pragma": "no-cache",
      "Expires": "0"
    },
  });
  if (!response.ok) {
    throw new Error("Failed to get leiding.");
  }
  return response.json();
};

const deleteLeiding = async (id: number) => {
  const token = JSON.parse(sessionStorage.getItem("loggedInUser") || "{}").token;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leiding`, {
      method: "DELETE",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        "id": id
    }),
  });
  if (!response.ok) {
      throw new Error("Leiding verwijderen mislukt.");
  }
};

const updateLeiding = async (id: number, naam: string, voornaam: string, telefoon: string, email: string) => {
  const token = JSON.parse(sessionStorage.getItem("loggedInUser") || "{}").token;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leiding`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
          naam,
          voornaam,
          telefoon,
          email
      }),
  });
  if (!response.ok) {
      throw new Error("Leiding bewerken mislukt.");
  }
  return response.json();
};

const addLeiding = async (naam: string, voornaam: string, telefoon: string, email: string, totem: string, rol: string, wachtwoord: string) => {
  const token = JSON.parse(sessionStorage.getItem("loggedInUser") || "{}").token;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leiding`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
          naam,
          voornaam,
          telefoon,
          email,
          totem,
          rol,
          wachtwoord
      }),
  });
  if (!response.ok) {
      throw new Error("Leiding toevoegen mislukt.");
  }
  return response.json();
};

const changeRole = async (id: number, rol: string) => {
  const token = JSON.parse(sessionStorage.getItem("loggedInUser") || "{}").token;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leiding/${id}/${rol}`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
      }
  });
  if (!response.ok) {
      throw new Error("Rol wijzigen mislukt.");
  }
  return response.json();
};

const changeGroup = async (id: number, groepNaam: string) => {
  const token = JSON.parse(sessionStorage.getItem("loggedInUser") || "{}").token;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leiding/groep/${id}/${groepNaam}`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
      }
  });
  if (!response.ok) {
      throw new Error("Groep wijzigen mislukt.");
  }
  return response.json();
};

const LeidingService = {
  getLeiding,
  deleteLeiding,
  updateLeiding,
  addLeiding,
  changeRole,
  changeGroup,
};

export default LeidingService;