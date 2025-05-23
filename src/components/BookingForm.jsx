// src/components/BookingForm.jsx
import React, { useState } from "react";
import { postReservation } from "../lib/api";

const services = [
  "Vernis permanent",
  "Pédicure",
  "Nail Art",
  "Gel",
  "Soin des mains et doigts",
];

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    service: "",
    date: "",
    time: "",
    name: "",
    phone: "",
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await postReservation(data);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Erreur API : " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-noir border border-gold rounded-xl p-4 sm:p-6 text-center text-rose shadow-lg max-w-md mx-auto">
        <h3 className="text-xl sm:text-2xl font-bold mb-4">Merci pour votre réservation !</h3>
        <p className="text-gold">Nous vous contacterons pour confirmer votre rendez-vous.</p>
      </div>
    );
  }

  return (
    <form
      className="bg-noir border border-gold rounded-xl p-4 sm:p-6 shadow-lg max-w-md mx-auto"
      onSubmit={handleSubmit}
    >
      <h3 className="text-lg sm:text-xl font-bold text-gold mb-4 sm:mb-6">Réservez votre rendez-vous</h3>

      {step === 1 && (
        <div>
          <label className="block mb-3 text-rose font-semibold">
            Prestation souhaitée
            <select
              name="service"
              value={data.service}
              onChange={handleChange}
              className="block w-full mt-2 p-2 rounded bg-noir text-gold border border-gold"
              required
            >
              <option value="">Choisissez…</option>
              {services.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={nextStep}
            disabled={!data.service}
            className="w-full sm:w-auto bg-gold text-noir py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg hover:bg-rose transition disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <label className="block mb-3 text-rose font-semibold">
            Date
            <input
              type="date"
              name="date"
              value={data.date}
              onChange={handleChange}
              className="block w-full mt-2 p-2 rounded bg-noir text-gold border border-gold"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </label>
          <label className="block mb-3 text-rose font-semibold">
            Heure
            <input
              type="time"
              name="time"
              value={data.time}
              onChange={handleChange}
              className="block w-full mt-2 p-2 rounded bg-noir text-gold border border-gold"
              required
            />
          </label>
          <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
            <button
              type="button"
              onClick={prevStep}
              className="text-rose underline"
            >
              Retour
            </button>
            <button
              type="button"
              onClick={nextStep}
              disabled={!data.date || !data.time}
              className="w-full sm:w-auto bg-gold text-noir py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg hover:bg-rose transition disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <label className="block mb-3 text-rose font-semibold">
            Nom complet
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              className="block w-full mt-2 p-2 rounded bg-noir text-gold border border-gold"
              required
              autoComplete="name"
            />
          </label>
          <label className="block mb-3 text-rose font-semibold">
            Téléphone
            <input
              type="tel"
              name="phone"
              value={data.phone}
              onChange={handleChange}
              className="block w-full mt-2 p-2 rounded bg-noir text-gold border border-gold"
              required
              pattern="[0-9]{10}"
              title="Veuillez entrer un numéro de téléphone valide (10 chiffres)"
              autoComplete="tel"
            />
          </label>
          <label className="block mb-3 text-rose font-semibold">
            Email (facultatif)
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              className="block w-full mt-2 p-2 rounded bg-noir text-gold border border-gold"
              autoComplete="email"
            />
          </label>
          <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
            <button
              type="button"
              onClick={prevStep}
              className="text-rose underline"
            >
              Retour
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-gold text-noir py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg hover:bg-rose transition disabled:opacity-50"
            >
              {isLoading ? "Envoi..." : "Réserver"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
