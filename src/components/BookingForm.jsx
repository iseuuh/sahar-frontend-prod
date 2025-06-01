// src/components/BookingForm.jsx
import React, { useState } from "react";
import { createReservation } from "../lib/api";

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

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 19; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    slots.push("19:00");
    return slots;
  };

  const timeSlots = generateTimeSlots();

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
      await createReservation(formData);
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
        <button
          onClick={() => setSuccess(false)}
          className="w-full bg-gold text-noir py-2 px-4 rounded hover:bg-rose transition-colors"
        >
          Nouvelle réservation
        </button>
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
                <option value="">Sélectionnez une heure</option>
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
              >
                Retour
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
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-gold">+216</span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone.slice(4)}
                  onChange={handleChange}
                  pattern="\d{8}"
                  title="Entrez 8 chiffres après le +216"
                  placeholder="xxxxxxxx"
                  className="w-full p-2 rounded bg-noir text-gold border border-gold focus:outline-none focus:border-rose"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gold mb-2">Email (optionnel)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 rounded bg-noir text-gold border border-gold focus:outline-none focus:border-rose"
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
            <div className="flex gap-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gold text-noir py-2 px-4 rounded hover:bg-rose transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Envoi...' : 'Réserver'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
