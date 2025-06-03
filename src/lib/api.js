const API_URL = process.env.REACT_APP_API_URL;
if (!API_URL) {
  console.error('REACT_APP_API_URL non définie dans les variables d\'environnement');
}
console.log('API URL in api.js:', API_URL);

async function request(endpoint, method = "GET", body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = data && data.message ? data.message : `API ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export default {
  // Créer réservation (déjà existant)
  createReservation: (payload) => request("/api/reservations", "POST", payload),
  // Récupérer toutes les réservations
  getReservations: (token) => request("/api/reservations", "GET", null, token),
  // Mettre à jour une réservation (statut)
  updateReservation: (id, body, token) => request(`/api/reservations/${id}`, "PATCH", body, token),
  // Supprimer une réservation (optionnel)
  deleteReservation: (id, token) => request(`/api/reservations/${id}`, "DELETE", null, token),
  // Login admin
  login: (payload) => request("/api/auth/login", "POST", payload),
  // Récupérer les réservations d'une date précise
  getReservationsByDate: (date, token) => request(`/api/reservations?date=${date}`, "GET", null, token)
}; 