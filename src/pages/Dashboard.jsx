import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import ReservationsTable from "../components/ReservationsTable";

const Dashboard = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ day: 0, week: 0, confirmed: 0, pending: 0 });

  // Fetch reservations for selected date
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/admin", { replace: true });
        const res = await api.getReservationsByDate(date, token);
        setReservations(res.data);
        // Stats
        const all = await api.getReservations(token);
        const today = new Date().toISOString().slice(0, 10);
        const week = all.data.filter(r => r.date >= today && r.date <= addDays(today, 7));
        setStats({
          day: all.data.filter(r => r.date === today).length,
          week: week.length,
          confirmed: all.data.filter(r => r.status === "confirmed").length,
          pending: all.data.filter(r => r.status === "pending").length
        });
      } catch (err) {
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [date, navigate]);

  function addDays(dateStr, days) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  // Actions
  const handleStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await api.updateReservation(id, { status }, token);
      setReservations(reservations => reservations.map(r => r._id === id ? { ...r, status } : r));
    } catch (err) {
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  const filtered = reservations.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.phone.includes(search)
  );

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin");
  };

  return (
    <div className="max-w-xl mx-auto p-4 min-h-screen bg-white">
      <div className="flex items-center justify-between mb-2">
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="p-2 rounded border" />
        <button onClick={handleLogout} className="ml-2 px-3 py-2 bg-rose text-white rounded">Déconnexion</button>
      </div>
      <input
        type="text"
        placeholder="Recherche nom ou téléphone..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <button onClick={() => setStatsOpen(o => !o)} className="mb-2 text-sm underline">{statsOpen ? "Masquer" : "Voir"} les stats</button>
      {statsOpen && (
        <div className="mb-2 p-2 bg-gray-100 rounded text-sm">
          <div>Réservations aujourd'hui : {stats.day}</div>
          <div>Cette semaine : {stats.week}</div>
          <div>Confirmées : {stats.confirmed}</div>
          <div>En attente : {stats.pending}</div>
        </div>
      )}
      <div className="mb-4">
        {loading ? <div>Chargement...</div> : filtered.length === 0 ? <div>Aucune réservation</div> : (
          <ul className="space-y-2">
            {filtered.map(r => (
              <li key={r._id} className="bg-gray-50 rounded p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow">
                <div className="flex-1">
                  <div className="font-bold text-lg">{r.name}</div>
                  <div className="text-sm">{r.phone} | {r.service}</div>
                  <div className="text-sm">{r.date} {r.time}</div>
                  <div className="text-xs">Statut : <span className={
                    r.status === "confirmed" ? "text-green-600" :
                    r.status === "pending" ? "text-yellow-600" :
                    r.status === "completed" ? "text-blue-600" : "text-gray-400"
                  }>{r.status}</span></div>
                </div>
                <div className="flex flex-row sm:flex-col gap-2 mt-2 sm:mt-0">
                  <button onClick={() => handleStatus(r._id, r.status === "confirmed" ? "cancelled" : "confirmed")}
                    className="px-2 py-1 rounded bg-gold text-noir min-w-[44px] min-h-[44px] text-sm">
                    {r.status === "confirmed" ? "Annuler" : "Confirmer"}
                  </button>
                  <a href={`tel:+216${r.phone}`} className="px-2 py-1 rounded bg-blue-500 text-white min-w-[44px] min-h-[44px] text-sm" target="_blank" rel="noopener noreferrer">Contact</a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button onClick={() => setShowTable(true)} className="w-full mb-4 py-2 bg-gold text-noir rounded">Tableau complet</button>
      {showTable && <ReservationsTable onClose={() => setShowTable(false)} />}
      <button
        className="fixed bottom-8 right-8 bg-rose text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl"
        style={{ minWidth: 56, minHeight: 56 }}
        onClick={() => setShowModal(true)}
        aria-label="Nouveau rendez-vous"
      >+
      </button>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h2 className="text-lg font-bold mb-2">Nouveau rendez-vous</h2>
            {/* Formulaire de création rapide ici (à compléter selon vos besoins) */}
            <button onClick={() => setShowModal(false)} className="mt-4 px-4 py-2 bg-gray-200 rounded">Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 