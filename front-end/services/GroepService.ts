const getAllGroepen = async () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + `/groep`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer span`,
        },
    });
};

const getGroepByNaam = async (naam: string) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + `/groep/${naam}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer span`,
        },
    });
}

const getAllGroepenWithAuth = async () => {
    const token = JSON.parse(sessionStorage.getItem("loggedInUser") || "{}").token;
    return fetch(process.env.NEXT_PUBLIC_API_URL + `/groep/all`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,	
        },
    });
}

const GroepService = {
    getAllGroepen,
    getGroepByNaam,
    getAllGroepenWithAuth,
};

export default GroepService;