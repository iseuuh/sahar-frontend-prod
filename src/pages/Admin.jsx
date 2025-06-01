import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

const Admin = () => {
  const [email, setEmail] = useState("admin@sahar.com");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await api.login({ email, password });
      localStorage.setItem("token", result.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      alert("Erreur de login : " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-noir text-gold p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Connexion Admin</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-noir border border-gold rounded text-gold"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-noir border border-gold rounded text-gold"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gold text-noir py-2 px-4 rounded font-medium hover:bg-gold/90 disabled:opacity-50"
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin; 