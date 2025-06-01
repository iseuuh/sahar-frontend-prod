import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import api from "../lib/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les réservations
  const fetchReservations = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/admin", { replace: true });
      const res = await api.getReservations(token);
      setReservations(res.data);
    } catch (err) {
      console.error("Erreur fetch réservations :", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // Transformer les réservations en événements FullCalendar
  const events = reservations.map(r => ({
    id: r._id,
    title: `${r.service} – ${r.name} (${r.status})`,
    start: `${r.date}T${r.time}`,
    end: `${r.date}T${addThirtyMinutes(r.time)}`,
    backgroundColor: r.status === "confirmed" ? "#D4AF37" : r.status === "pending" ? "#FF69B4" : "#999999",
    borderColor: "#000"
  }));

  // Ajoute 30 minutes à un créneau de type "HH:mm"
  function addThirtyMinutes(time) {
    const [h, m] = time.split(":").map(Number);
    let date = new Date(0,0,0,h,m);
    date.setMinutes(date.getMinutes() + 30);
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  // Au clic sur un événement, afficher un modal de détail + action
  const handleEventClick = async (clickInfo) => {
    const id = clickInfo.event.id;
    const resObj = reservations.find(r => r._id === id);
    if (!resObj) return;
    const newStatus = prompt(
      `Modifier le statut de la réservation de ${resObj.name} (${resObj.service} à ${resObj.time}) :\n(leave vide pour annuler)\n1 = confirmed\n2 = cancelled`, 
      resObj.status
    );
    if (newStatus === null) return;
    let statusText = "";
    if (newStatus === "1") statusText = "confirmed";
    else if (newStatus === "2") statusText = "cancelled";
    else return alert("Statut invalide");

    try {
      await api.updateReservation(id, { status: statusText }, localStorage.getItem("token"));
      alert(`Statut mis à jour en ${statusText}`);
      fetchReservations();
    } catch (err) {
      console.error("Erreur update statut :", err);
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  if (loading) return <p>Chargement...</p>;
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard Réservations</h1>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        slotMinTime="09:00:00"
        slotMaxTime="19:00:00"
        slotDuration="00:30:00"
        allDaySlot={false}
        height="auto"
        events={events}
        eventClick={handleEventClick}
      />
      <button onClick={() => navigate("/admin", { replace: true })} className="mt-4 bg-black text-white py-2 px-4 rounded">
        Se déconnecter
      </button>
    </div>
  );
};

export default Dashboard; 