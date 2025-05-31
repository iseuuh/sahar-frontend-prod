import React, { useState } from 'react';
import ReservationsTable from '../components/ReservationsTable';

export default function Admin() {
  const [pass, setPass] = useState('');
  const [authed, setAuthed] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;
  
  console.log('API URL:', API_URL); // Debug line

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@sahar.com', password: pass })
      });
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Mot de passe incorrect (Admin123!)');
        }
        throw new Error('Erreur de connexion');
      }
      const { token } = await res.json();
      localStorage.setItem('token', token);
      setAuthed(true);
    } catch (err) {
      alert('Erreur de login : ' + err.message);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-noir text-gold">
        <form onSubmit={handleLogin} className="bg-noir/80 p-8 rounded shadow-lg">
          <h2 className="text-2xl mb-4">Admin Login</h2>
          <input
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            placeholder="Mot de passe (Admin123!)"
            className="w-full p-2 mb-4 rounded border border-gold bg-noir text-gold"
          />
          <button type="submit" className="w-full py-2 bg-gold text-noir rounded">
            Se connecter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 bg-noir min-h-screen text-gold">
      <h1 className="text-3xl mb-6">Panneau Admin</h1>
      <ReservationsTable />
    </div>
  );
} 