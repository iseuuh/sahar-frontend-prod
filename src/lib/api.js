// Utilisation de l'URL de l'API définie globalement
const API_URL = window.API_URL || 'https://sahar-backend.onrender.com';

// Log pour le débogage
console.log('API URL in api.js:', API_URL);

export const createReservation = async (payload) => {
  if (!payload) {
    throw new Error('Données de réservation invalides');
  }

  try {
    const response = await fetch(`${API_URL}/api/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API ${response.status}: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Mot de passe incorrect');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erreur de connexion');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur de login:', error);
    throw error;
  }
};

export const getReservations = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/reservations`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Session expirée');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erreur lors de la récupération des réservations');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    throw error;
  }
}; 