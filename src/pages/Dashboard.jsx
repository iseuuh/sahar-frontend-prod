import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReservationsTable from '../components/ReservationsTable';

const API_URL = process.env.REACT_APP_API_URL || 'https://sahar-backend.onrender.com';

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

    fetch(`${API_URL}/api/reservations`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((r) => {
        if (r.status === 401) {
          localStorage.removeItem('token');
          navigate('/admin');
          throw new Error('Session expirée');
        }
        if (!r.ok) throw new Error('Impossible de récupérer les réservations');
        return r.json();
      })
      .then((json) => {
        setData(Array.isArray(json.data) ? json.data : []);
      })
      .catch((err) => {
        setError(err.message);
        if (err.message === 'Session expirée') {
          navigate('/admin');
        }
      })
      .finally(() => setLoading(false));
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