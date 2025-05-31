import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './lib/api';  // Import de l'API en premier
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

// Définition de l'URL de l'API
const API_URL = process.env.REACT_APP_API_URL || 'https://sahar-backend.onrender.com';

// Définition globale de l'API_URL
window.API_URL = API_URL;

// Log pour le débogage
console.log('API_URL définie dans index.js:', API_URL);

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
