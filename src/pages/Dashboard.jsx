import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReservationsTable from '../components/ReservationsTable';

// Utilisation d'une valeur par défaut si VITE_API_URL n'est pas défini
const API_URL = import.meta.env.VITE_API_URL || 'https://sahar-backend.onrender.com';

// Log pour le débogage
console.log('Dashboard API_URL:', API_URL);

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin');
      return;
    }

    const controller = new AbortController();

    fetch(`${API_URL}/api/reservations`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      signal: controller.signal
    })
      .then(async (r) => {
        if (r.status === 401) {
          localStorage.removeItem('token');
          navigate('/admin');
          throw new Error('Session expirée');
        }
        if (!r.ok) {
          const txt = await r.text();
          throw new Error(`API ${r.status}: ${txt}`);
        }
        return r.json();
      })
      .then((json) => {
        if (!json || !Array.isArray(json.data)) {
          throw new Error('Format de réponse invalide');
        }
        setData(json.data);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('Erreur Dashboard:', err);
        setError(err.message);
        if (err.message === 'Session expirée') {
          navigate('/admin');
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-noir text-gold">
        <p>Chargement des réservations…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-noir text-rose">
        <p>Erreur : {error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 text-gold bg-noir min-h-screen">
      <h1 className="text-3xl mb-6">Tableau de bord</h1>
      <ReservationsTable reservations={data} />
    </div>
  );
} 