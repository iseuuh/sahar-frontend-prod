import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReservations } from '../lib/api';
import ReservationsTable from '../components/ReservationsTable';

// Utilisation de la variable globale définie dans index.js
const API_URL = window.API_URL;

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
      console.log('Pas de token trouvé, redirection vers /admin');
      navigate('/admin');
      return;
    }

    const fetchData = async () => {
      try {
        console.log('Récupération des réservations...');
        const response = await getReservations(token);
        console.log('Réponse API:', response);

        // Gérer différents formats de réponse
        const reservations = Array.isArray(response) ? response : 
                           response.data ? response.data :
                           response.reservations ? response.reservations : [];

        if (!Array.isArray(reservations)) {
          throw new Error('Format de réponse invalide');
        }

        setData(reservations);
      } catch (err) {
        console.error('Erreur Dashboard:', err);
        setError(err.message);
        if (err.message === 'Session expirée') {
          localStorage.removeItem('token');
          navigate('/admin');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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