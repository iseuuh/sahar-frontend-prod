// Utilisation de la variable globale définie dans index.js
const API_URL = window.API_URL;

// Log pour le débogage
console.log('API_URL:', API_URL);

export async function postReservation(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Données de réservation invalides');
  }

  const res = await fetch(`${API_URL}/api/reservations`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`API ${res.status}: ${txt}`);
  }

  return res.json();
} 