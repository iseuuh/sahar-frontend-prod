import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BookingForm from './components/BookingForm';
import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/booking" element={<BookingForm />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
