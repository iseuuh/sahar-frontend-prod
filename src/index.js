import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './lib/api';  // Déplacé en haut avec les autres imports
import reportWebVitals from './reportWebVitals';

// Définition de l'URL de l'API avant le rendu
window.API_URL = import.meta.env.VITE_API_URL || 'https://sahar-backend.onrender.com';

// Log pour le débogage
console.log('API_URL:', window.API_URL);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
