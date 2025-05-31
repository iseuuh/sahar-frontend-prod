// Utilisation d'une valeur par défaut si VITE_API_URL n'est pas défini
const API_URL = import.meta.env.VITE_API_URL || 'https://sahar-backend.onrender.com';

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