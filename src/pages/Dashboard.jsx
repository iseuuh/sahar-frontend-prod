import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReservations } from '../lib/api';
import ReservationsTable from '../components/ReservationsTable';

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

        // Vérification et transformation des données
        let reservations = [];
        if (response) {
          if (Array.isArray(response)) {
            reservations = response;
          } else if (response.data && Array.isArray(response.data)) {
            reservations = response.data;
          } else if (response.reservations && Array.isArray(response.reservations)) {
            reservations = response.reservations;
          }
        }

        // Validation des données
        reservations = reservations.filter(res => 
          res && typeof res === 'object' && 
          res._id && 
          res.service && 
          res.date && 
          res.time && 
          res.name
        );

        setData(reservations);
      } catch (err) {
        console.error('Erreur Dashboard:', err);
        setError(err.message || 'Erreur lors du chargement des réservations');
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
      {data.length > 0 ? (
        <ReservationsTable reservations={data} />
      ) : (
        <p className="text-center text-gold">Aucune réservation trouvée</p>
      )}
    </div>
  );
} 