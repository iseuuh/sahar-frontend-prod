import Header from "../src/components/Header";
import Navbar from "../src/components/Navbar";
import ServiceCard from "../src/components/ServiceCard";
import BookingForm from "../src/components/BookingForm";

export default function Home() {
  // Exemple de liste de services fictive pour ServiceCard
  const services = [
    { id: 1, name: "Manucure", price: "25€", description: "Soins des ongles et vernis" },
    { id: 2, name: "Pédicure", price: "30€", description: "Soin complet des pieds" },
  ];

  return (
    <div>
      <Header />
      <Navbar />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", margin: "24px 0" }}>
        {services.map((service) => (
          <ServiceCard key={service.id} {...service} />
        ))}
      </div>
      <BookingForm />
    </div>
  );
}