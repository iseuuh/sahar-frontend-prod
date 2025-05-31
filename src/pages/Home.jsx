import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import ServiceCard from "../components/ServiceCard";
import BookingForm from "../components/BookingForm";
import { FaPaintBrush, FaHandSparkles, FaSpa, FaGem, FaRegSmile } from "react-icons/fa";

export default function Home() {
  return (
    <div className="bg-noir min-h-screen font-sans relative h-screen">
      <Header />

      {/* HERO VIDEO + OVERLAY */}
      <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
        {/* Vidéo en arrière-plan */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster="/images/marble-bg.png"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>

        {/* Overlay sombre + contenu centré */}
        <div className="absolute inset-0 bg-noir bg-opacity-60 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-7xl font-bold text-gold drop-shadow-xl">
            Sahâr Nail Care
          </h1>
          <p className="mt-4 text-base md:text-2xl text-rose drop-shadow-lg">
            L'art de sublimer vos mains.
          </p>
          <Link
            to="/booking"
            className="mt-8 inline-block bg-gold text-noir py-2 md:py-3 px-6 md:px-8 rounded-full text-base md:text-lg font-semibold shadow-lg hover:bg-rose transition duration-300"
          >
            Réservez maintenant
          </Link>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="container mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold text-gold text-center mb-8">Nos Prestations</h2>
        <div className="flex flex-wrap gap-8 justify-center">
          <ServiceCard icon={<FaHandSparkles />} title="Manucure" description="Beauté raffinée des mains." />
          <ServiceCard icon={<FaSpa />} title="Pédicure" description="Soins élégants des pieds." />
          <ServiceCard icon={<FaPaintBrush />} title="Nail Art" description="Art créatif personnalisé." />
          <ServiceCard icon={<FaGem />} title="Gel" description="Durabilité & élégance prolongée." />
          <ServiceCard icon={<FaRegSmile />} title="Soin des mains" description="Hydratation & douceur absolue." />
        </div>
      </section>

      {/* BOOKING */}
      <section id="booking" className="container mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold text-gold text-center mb-8">Prendre Rendez-vous</h2>
        <BookingForm />
      </section>

      {/* FOOTER */}
      <footer className="bg-noir border-t border-gold py-8 text-center">
        <p className="text-gold">© Sahâr Nail Care – Tous droits réservés</p>
      </footer>
    </div>
  );
}
