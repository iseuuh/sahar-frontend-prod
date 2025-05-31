import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ReservationsTable from './components/ReservationsTable';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <>
      <nav className="p-4 bg-noir text-gold flex justify-between">
        <Link to="/" className="font-bold">Sahâr Nail Care</Link>
        <Link to="/admin" className="underline">Admin</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <ReservationsTable />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}
