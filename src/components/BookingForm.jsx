// src/components/BookingForm.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SiTiktok } from "react-icons/si";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import api from "../lib/api";

const services = [
  "Vernis permanent",
  "Pédicure",
  "Nail Art",
  "Gel",
  "Soin des mains et doigts",
];

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: "",
    date: "",
    time: "",
    name: "",
    phone: "+216",
    email: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

  // Charger les créneaux réservés au montage du composant
  useEffect(() => {
    const fetchBooked = async () => {
      try {
        const res = await api.getReservations();
        // Filtrer uniquement les réservations confirmées
        const confirmed = res.data.filter(r => r.status === "confirmed");
        // Générer un tableau de chaînes "YYYY-MM-DD|HH:mm" pour comparer
        setBookedSlots(confirmed.map(r => `${r.date}|${r.time}`));
      } catch (err) {
        console.error("Impossible de charger les réservations :", err);
      }
    };
    fetchBooked();
  }, []);

  // Générer les créneaux horaires avec état disabled
  const generateTimeSlots = (date) => {
    const slots = [];
    for (let hour = 9; hour < 19; hour++) {
      for (let minute of [0, 30]) {
        const hh = String(hour).padStart(2, "0");
        const mm = String(minute).padStart(2, "0");
        const slotKey = `${date}|${hh}:${mm}`;
        const disabled = bookedSlots.includes(slotKey);
        slots.push({ time: `${hh}:${mm}`, disabled });
      }
    }
    return slots;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      const raw = value.replace(/\D/g, "").slice(0, 8);
      setFormData(prev => ({
        ...prev,
        [name]: "+216" + raw
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (formData.phone.length !== 12) {
      setError("Le numéro de téléphone doit être un numéro tunisien valide (+216 + 8 chiffres)");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const reservationData = {
        ...formData,
        phone: formData.phone.slice(4)
      };
      console.log("Envoi de la réservation:", { ...reservationData, phone: "XXXXXXXX" });
      await api.createReservation(reservationData);
      setSuccess(true);
      setFormData({
        service: "",
        date: "",
        time: "",
        name: "",
        phone: "+216",
        email: "",
        notes: ""
      });
      setStep(1);
    } catch (err) {
      setError(err.message);
      console.error("Erreur lors de la réservation:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !formData.service) {
      setError("Veuillez sélectionner un service");
      return;
    }
    if (step === 2 && (!formData.date || !formData.time)) {
      setError("Veuillez sélectionner une date et une heure");
      return;
    }
    setError("");
    setStep(step + 1);
  };

  const prevStep = () => {
    setError("");
    setStep(step - 1);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto p-6 bg-noir rounded-lg shadow-lg border border-gold">
        <h2 className="text-2xl font-bold text-gold mb-4">Réservation confirmée !</h2>
        <p className="text-gold mb-4">
          Merci pour votre réservation. Nous vous contacterons bientôt pour confirmer votre rendez-vous.
        </p>
        <Link 
          to="/" 
          className="mt-4 inline-block w-full bg-gold text-noir py-2 px-4 rounded hover:bg-rose transition-colors text-center"
        >
          Retour à l'accueil
        </Link>
        <div className="flex justify-center space-x-6 mt-6">
          <a 
            href="https://www.tiktok.com/@saharnailcare" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-2xl text-gold hover:text-rose transition-colors"
          >
            <SiTiktok />
          </a>
          <a 
            href="https://www.instagram.com/saharnailcare" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-2xl text-gold hover:text-rose transition-colors"
          >
            <FaInstagram />
          </a>
          <a 
            href="https://www.facebook.com/saharnailcare" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-2xl text-gold hover:text-rose transition-colors"
          >
            <FaFacebook />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-noir rounded-lg shadow-lg border border-gold">
      <h2 className="text-2xl font-bold text-gold mb-6">Réservation</h2>
      {error && (
        <div className="mb-4 p-3 bg-rose/20 border border-rose rounded text-rose">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-gold mb-2">Service</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full p-2 rounded bg-noir text-gold border border-gold focus:outline-none focus:border-rose"
                required
              >
                <option value="">Sélectionnez un service</option>
                {services.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={nextStep}
              className="w-full bg-gold text-noir py-2 px-4 rounded hover:bg-rose transition-colors"
            >
              Suivant
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-gold mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-2 rounded bg-noir text-gold border border-gold focus:outline-none focus:border-rose"
                required
              />
            </div>
            <div>
              <label className="block text-gold mb-2">Heure</label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full p-2 rounded bg-noir text-gold border border-gold focus:outline-none focus:border-rose"
                required
              >
                <option value="">Choisissez un créneau</option>
                {formData.date && generateTimeSlots(formData.date).map(slot => (
                  <option 
                    key={slot.time} 
                    value={slot.time} 
                    disabled={slot.disabled}
                    className={slot.disabled ? "text-gray-500" : ""}
                  >
                    {slot.time} {slot.disabled ? "(Indisponible)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
              >
                Précédent
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 bg-gold text-noir py-2 px-4 rounded hover:bg-rose transition-colors"
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-gold mb-2">Nom complet</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 rounded bg-noir text-gold border border-gold focus:outline-none focus:border-rose"
                required
              />
            </div>
            <div>
              <label className="block text-gold mb-2">Téléphone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 rounded bg-noir text-gold border border-gold focus:outline-none focus:border-rose"
                required
              />
            </div>
            <div>
              <label className="block text-gold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 rounded bg-noir text-gold border border-gold focus:outline-none focus:border-rose"
                required
              />
            </div>
            <div>
              <label className="block text-gold mb-2">Notes (optionnel)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full p-2 rounded bg-noir text-gold border border-gold focus:outline-none focus:border-rose"
                rows="3"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
              >
                Précédent
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gold text-noir py-2 px-4 rounded hover:bg-rose transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Envoi..." : "Réserver"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
