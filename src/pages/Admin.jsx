import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../lib/api';

// Utilisation de la variable globale définie dans index.js
const API_URL = window.API_URL;

// Log pour le débogage
console.log('Admin API_URL:', API_URL);

export default function Admin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Log pour le débogage
    console.log('Tentative de connexion avec:', {
      email: 'admin@sahar.com',
      passwordLength: password.length
    });

    try {
      const data = await login({
        email: 'admin@sahar.com',
        password: password.trim() // Assurez-vous qu'il n'y a pas d'espaces
      });

      console.log('Réponse de connexion:', data);
      localStorage.setItem('token', data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Erreur détaillée de login:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-noir flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-noir p-8 rounded-lg shadow-lg border border-gold">
        <h1 className="text-3xl font-bold mb-6 text-gold text-center">Administration</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-gold mb-2">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-noir text-gold border border-gold focus:outline-none focus:border-rose"
              required
              disabled={isLoading}
            />
          </div>
          {error && (
            <div className="text-rose text-sm text-center">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-gold text-noir py-2 px-4 rounded hover:bg-rose transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
} 