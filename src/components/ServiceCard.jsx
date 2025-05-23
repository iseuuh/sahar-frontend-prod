// src/components/ServiceCard.jsx
import React from "react";

export default function ServiceCard({ icon, title, description }) {
  return (
    <div className="bg-noir border border-gold rounded-xl p-6 text-center w-64 hover:shadow-lg transition duration-300">
      <div className="text-4xl text-gold mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gold mb-2">{title}</h3>
      <p className="text-rose">{description}</p>
    </div>
  );
}
