// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [startups, setStartups] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/startups")
      .then(res => setStartups(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Startup India Dashboard</h1>
      <p>Total Startups: {startups.length}</p>
      <ul className="mt-4 space-y-2">
        {startups.map(s => (
          <li key={s._id} className="p-2 bg-gray-800 rounded-lg">
            {s.name} — {s.state} — {s.sector}
          </li>
        ))}
      </ul>
    </div>
  );
}
