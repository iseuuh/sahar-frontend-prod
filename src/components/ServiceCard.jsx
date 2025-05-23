// src/components/ServiceCard.jsx
import React from "react";

export default function ServiceCard({ icon, title, description }) {
  return (
    <div className="bg-gold text-noir py-3 px-8 rounded-full shadow-lg hover:bg-rose transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-center text-base">{description}</p>
    </div>
  );
}
