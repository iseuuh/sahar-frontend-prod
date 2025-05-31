import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchReservations } from '../lib/api';

export default function Dashboard() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Dashboard monté, token:', localStorage.getItem('token') ? 'présent' : 'absent');
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Pas de token, redirection vers /admin');
      navigate('/admin', { replace: true });
      return;
    }

    const loadReservations = async () => {
      try {
        console.log('Chargement des réservations...');
        const result = await fetchReservations(token);
        console.log('Réponse API (fetchReservations):', result);

        // Vérification et transformation des données
        let data = [];
        if (result) {
          if (Array.isArray(result)) {
            data = result;
          } else if (result.data && Array.isArray(result.data)) {
            data = result.data;
          } else if (result.reservations && Array.isArray(result.reservations)) {
            data = result.reservations;
          }
        }

        // Validation des données
        data = data.filter(res => 
          res && typeof res === 'object' && 
          res._id && 
          res.service && 
          res.date && 
          res.time && 
          res.name
        );

        console.log('Réservations validées:', data.length);
        setReservations(data);
      } catch (err) {
        console.error('Erreur Dashboard:', err);
        setError(err.message || 'Erreur lors du chargement des réservations');
        if (err.message === 'Session expirée') {
          localStorage.removeItem('token');
          navigate('/admin', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
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

  // Pour le débogage, on affiche d'abord le JSON brut
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="p-8 text-gold bg-noir min-h-screen">
        <h1 className="text-3xl mb-6">Dashboard Admin (Debug)</h1>
        <pre className="bg-noir border border-gold p-4 rounded overflow-auto">
          {JSON.stringify(reservations, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="p-8 text-gold bg-noir min-h-screen">
      <h1 className="text-3xl mb-6">Tableau de bord</h1>
      {reservations.length === 0 ? (
        <p className="text-center text-gold">Aucune réservation trouvée</p>
      ) : (
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-gold">
              <th className="py-3 px-4 text-left">Service</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Heure</th>
              <th className="py-3 px-4 text-left">Nom</th>
              <th className="py-3 px-4 text-left">Téléphone</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(res => (
              <tr key={res._id} className="border-b border-gold/30 hover:bg-gold/5">
                <td className="py-3 px-4">{res.service}</td>
                <td className="py-3 px-4">{new Date(res.date).toLocaleDateString()}</td>
                <td className="py-3 px-4">{res.time}</td>
                <td className="py-3 px-4">{res.name}</td>
                <td className="py-3 px-4">{res.phone}</td>
                <td className="py-3 px-4">{res.email}</td>
                <td className="py-3 px-4">{res.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 