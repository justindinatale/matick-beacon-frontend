import React, { useState, useEffect, useCallback } from "react";

const API_URL = "https://matick-beacon.onrender.com";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [projects, setProjects] = useState([]);

  // Intake form fields
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [budgetEstimate, setBudgetEstimate] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("pricing");

  // ---- Auth ----
  const handleRegister = async () => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    alert(JSON.stringify(data));
  };

  const handleLogin = async () => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      localStorage.setItem("token", data.token);
    } else {
      alert("Login failed: " + (data.error || "Unknown error"));
    }
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  // ---- Projects ----
  const fetchProjects = useCallback(async () => {
    if (!token) return;
    const res = await fetch(`${API_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    // Sorting by status priority
    const order = { pricing: 1, Design: 2, "Bid submitted": 3, Completed: 4 };
    setProjects(
      data.sort((a, b) => {
        if (a.status !== b.status) {
          return (order[a.status] || 99) - (order[b.status] || 99);
        }
        return new Date(b.created_at) - new Date(a.created_at);
      })
    );
  }, [token]);

  useEffect(() => {
    if (token) fetchProjects();
  }, [token, fetchProjects]);

  const handleAddProject = async () => {
    if (!clientName || !projectName) {
      alert("Client Name and Project Name are required");
      return;
    }

    const res = await fetch(`${API_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        project_name: projectName,
        project_location: projectLocation,
        budget_estimate: budgetEstimate,
        notes,
        status,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      fetchProjects();
      setClientName(""); setClientEmail(""); setClientPhone("");
      setProjectName(""); setProjectLocation(""); setBudgetEstimate("");
      setNotes(""); setStatus("pricing");
    } else {
      alert("Error adding project: " + (data.error || "Unknown error"));
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const res = await fetch(`${API_URL}/projects/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    const updated = await res.json();
    if (res.ok) {
      setProjects(projects.map(p => p.id === id ? updated : p));
    } else {
      alert("Error updating status: " + (updated.error || "Unknown error"));
    }
  };

  const activeProjects = projects.filter(p => p.status !== "Completed");
  const completedProjects = projects.filter(p => p.status === "Completed");

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Matick Beacon Frontend</h1>

      {!token ? (
        <>
          <h2>Register / Login</h2>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={handleRegister}>Register</button>
          <button onClick={handleLogin}>Login</button>
        </>
      ) : (
        <>
          <button onClick={handleLogout}>Logout</button>
          <h2>Active Projects</h2>
          <button onClick={fetchProjects}>Refresh Projects</button>
          <ul>
            {activeProjects.map((p) => (
              <li key={p.id} style={{ margin: "1rem", border: "1px solid #ccc", padding: "1rem" }}>
                <strong>{p.project_name}</strong> - {p.client_name}
                <br/>📧 {p.client_email} | 📱 {p.client_phone}
                <br/>📍 {p.project_location} | 💵 ${p.budget_estimate}
                <br/>📝 {p.notes}
                <br/>
                <label>Status: </label>
                <select value={p.status} onChange={e => handleStatusChange(p.id, e.target.value)}>
                  <option value="pricing">Pricing</option>
                  <option value="Design">Design</option>
                  <option value="Bid submitted">Bid submitted</option>
                  <option value="Completed">Completed</option>
                </select>
              </li>
            ))}
          </ul>

          <h2>Completed Project Dashboard</h2>
          <ul>
            {completedProjects.map((p) => (
              <li key={p.id} style={{ margin: "1rem", border: "1px solid green", padding: "1rem" }}>
                <strong>{p.project_name}</strong> - {p.client_name}
                <br/>📧 {p.client_email} | 📱 {p.client_phone}
                <br/>📍 {p.project_location} | 💵 ${p.budget_estimate}
                <br/>📝 {p.notes}
                <br/>
                <label>Status: </label>
                <select value={p.status} onChange={e => handleStatusChange(p.id, e.target.value)}>
                  <option value="pricing">Pricing</option>
                  <option value="Design">Design</option>
                  <option value="Bid submitted">Bid submitted</option>
                  <option value="Completed">Completed</option>
                </select>
              </li>
            ))}
          </ul>

          <h3>Add Project</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "400px" }}>
            <input placeholder="Client Name" value={clientName} onChange={e=>setClientName(e.target.value)} />
            <input placeholder="Client Email" value={clientEmail} onChange={e=>setClientEmail(e.target.value)} />
            <input placeholder="Client Phone" value={clientPhone} onChange={e=>setClientPhone(e.target.value)} />
            <input placeholder="Project Name" value={projectName} onChange={e=>setProjectName(e.target.value)} />
            <input placeholder="Project Location" value={projectLocation} onChange={e=>setProjectLocation(e.target.value)} />
            <input placeholder="Budget Estimate" value={budgetEstimate} onChange={e=>setBudgetEstimate(e.target.value)} />
            <textarea placeholder="Notes" value={notes} onChange={e=>setNotes(e.target.value)}></textarea>
            <select value={status} onChange={e=>setStatus(e.target.value)}>
              <option value="pricing">Pricing</option>
              <option value="Design">Design</option>
              <option value="Bid submitted">Bid submitted</option>
              <option value="Completed">Completed</option>
            </select>
            <button onClick={handleAddProject}>Add Project</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;