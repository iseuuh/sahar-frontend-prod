const API_URL = process.env.REACT_APP_API_URL;
if (!API_URL) {
  throw new Error(
    "⚠️  REACT_APP_API_URL n'est pas défini. Ajoute-le dans Vercel, puis redeploie."
  );
}

export async function postReservation(payload) {
  const res = await fetch(`${API_URL}/api/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`API ${res.status}: ${txt}`);
  }
  return res.json();
} 