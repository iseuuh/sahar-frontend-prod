const API_URL = process.env.REACT_APP_API_URL;
if (!API_URL) {
  console.error('REACT_APP_API_URL non définie dans les variables d\'environnement');
}
console.log('API URL in api.js:', API_URL);

export const createReservation = async (payload) => {
  if (!payload) {
    throw new Error('Données de réservation invalides');
  }

  try {
    console.log('Création réservation:', { service: payload.service, date: payload.date });
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

    const data = await response.json();
    console.log('Réservation créée:', { id: data._id });
    return data;
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

export const fetchReservations = async (token) => {
  try {
    console.log('Fetching reservations with token:', token ? 'présent' : 'absent');
    const response = await fetch(`${API_URL}/api/reservations`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Session expirée');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erreur lors de la récupération des réservations');
    }

    const data = await response.json();
    console.log('Réservations récupérées:', { count: Array.isArray(data) ? data.length : 'format inattendu' });
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    throw error;
  }
};

export const loginAdmin = async (password) => {
  try {
    console.log('Tentative de login avec:', { email: 'admin@sahar.com', passwordLength: password.length });
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@sahar.com',
        password: password.trim()
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Mot de passe incorrect');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erreur de connexion');
    }

    const data = await response.json();
    console.log('Login réussi:', { token: data.token ? 'présent' : 'absent' });
    return data;
  } catch (error) {
    console.error('Erreur de login:', error);
    throw error;
  }
}; 