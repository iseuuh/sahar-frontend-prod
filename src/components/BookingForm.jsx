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
    phone: "",
    email: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await createReservation(formData);
      setSuccess(true);
      setFormData({
        service: "",
        date: "",
        time: "",
        name: "",
        phone: "",
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
                <option value="Manucure">Manucure</option>
                <option value="Pédicure">Pédicure</option>
                <option value="Nail Art">Nail Art</option>
                <option value="Soin des mains">Soin des mains</option>
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
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
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
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]{10}"
                placeholder="0612345678"
                className="w-full p-2 rounded bg-noir text-gold border border-gold focus:outline-none focus:border-rose"
                required
              />
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
