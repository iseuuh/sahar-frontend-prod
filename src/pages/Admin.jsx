import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error("⚠️  VITE_API_URL n'est pas défini");
}

export default function Admin() {
  const [pwd, setPwd] = useState('');
  const [errorMsg, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: 'admin@sahar.com', password: pwd })
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Mot de passe incorrect');
      }

      const { token } = await res.json();
      if (!token) {
        throw new Error('Token manquant dans la réponse');
      }

      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      console.error('Erreur de login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-noir text-gold">
      <h1 className="text-3xl mb-6">Accès Admin</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-64">
        <input
          type="password"
          placeholder="Mot de passe"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white"
          required
        />
        <button
          type="submit"
          disabled={loading || pwd.trim() === ''}
          className="p-2 bg-gold text-noir rounded font-bold disabled:opacity-50"
        >
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
        {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}
      </form>
    </div>
  );
} 