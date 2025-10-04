import { useState } from "react";

export default function HouseForm({ onCreated }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/houses/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      onCreated(data);
      setName("");
    } else {
      setError(data.error || "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto" }}>
      <input
        type="text"
        placeholder="House name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{ padding: "0.5rem 1rem" }}
      >
        {loading ? "Creating..." : "Create House"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
