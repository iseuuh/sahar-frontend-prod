import React, { useEffect, useState } from 'react';
import ReservationsTable from '../components/ReservationsTable';

const API_URL = import.meta.env.VITE_API_URL || 'https://sahar-backend.onrender.com';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/reservations`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => setData(d.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 text-gold bg-noir min-h-screen">
      <h1 className="text-3xl mb-6">Réservations</h1>
      {loading ? <p>Chargement…</p> : <ReservationsTable reservations={data} />}
    </div>
  );
} 