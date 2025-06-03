import React, { useEffect, useState } from "react";
import api from "../lib/api";

export default function ReservationsTable({ onClose }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await api.getReservations(token);
        setReservations(res.data.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)));
      } catch (err) {
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await api.updateReservation(id, { status }, token);
      setReservations(reservations => reservations.map(r => r._id === id ? { ...r, status } : r));
    } catch (err) {
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow max-w-2xl w-full overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Tableau complet des réservations</h2>
          <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded">Fermer</button>
        </div>
        {loading ? <div>Chargement...</div> : (
          <div>
            {/* Table sur desktop, cartes sur mobile */}
            <div className="hidden sm:block">
              <table className="w-full text-sm border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">Nom</th>
                    <th className="p-2">Téléphone</th>
                    <th className="p-2">Service</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">Heure</th>
                    <th className="p-2">Statut</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map(r => (
                    <tr key={r._id} className="border-b">
                      <td className="p-2">{r.name}</td>
                      <td className="p-2"><a href={`tel:+216${r.phone}`}>{r.phone}</a></td>
                      <td className="p-2">{r.service}</td>
                      <td className="p-2">{r.date}</td>
                      <td className="p-2">{r.time}</td>
                      <td className="p-2">{r.status}</td>
                      <td className="p-2 flex gap-1">
                        <button onClick={() => handleStatus(r._id, r.status === "confirmed" ? "cancelled" : "confirmed")}
                          className="px-2 py-1 rounded bg-gold text-noir min-w-[44px] min-h-[44px] text-xs">
                          {r.status === "confirmed" ? "Annuler" : "Confirmer"}
                        </button>
                        <a href={`tel:+216${r.phone}`} className="px-2 py-1 rounded bg-blue-500 text-white min-w-[44px] min-h-[44px] text-xs" target="_blank" rel="noopener noreferrer">Contact</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Cartes sur mobile */}
            <div className="sm:hidden space-y-3">
              {reservations.map(r => (
                <div key={r._id} className="bg-gray-50 rounded p-3 shadow flex flex-col gap-1">
                  <div className="font-bold text-lg">{r.name}</div>
                  <div className="text-sm">{r.phone} | {r.service}</div>
                  <div className="text-sm">{r.date} {r.time}</div>
                  <div className="text-xs">Statut : <span className={
                    r.status === "confirmed" ? "text-green-600" :
                    r.status === "pending" ? "text-yellow-600" :
                    r.status === "completed" ? "text-blue-600" : "text-gray-400"
                  }>{r.status}</span></div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleStatus(r._id, r.status === "confirmed" ? "cancelled" : "confirmed")}
                      className="px-2 py-1 rounded bg-gold text-noir min-w-[44px] min-h-[44px] text-xs">
                      {r.status === "confirmed" ? "Annuler" : "Confirmer"}
                    </button>
                    <a href={`tel:+216${r.phone}`} className="px-2 py-1 rounded bg-blue-500 text-white min-w-[44px] min-h-[44px] text-xs" target="_blank" rel="noopener noreferrer">Contact</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 