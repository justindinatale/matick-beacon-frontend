import React, { useState, useEffect, useCallback } from "react";

const API_URL = "https://matick-beacon.onrender.com";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Register
  const handleRegister = async () => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    alert(JSON.stringify(data));
  };

  // Login
  const handleLogin = async () => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
    }
    alert("Logged in! Token saved.");
  };

  // Fetch projects (wrapped in useCallback so it doesn’t re-create each render)
  const fetchProjects = useCallback(async () => {
    if (!token) return;
    const res = await fetch(`${API_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProjects(data);
  }, [token]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Add project
  const handleAddProject = async () => {
    const res = await fetch(`${API_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });
    const data = await res.json();
    setProjects([data, ...projects]);
    setTitle("");
    setDescription("");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Matick Beacon Frontend</h1>

      {!token ? (
        <>
          <h2>Register / Login</h2>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleRegister}>Register</button>
          <button onClick={handleLogin}>Login</button>
        </>
      ) : (
        <>
          <h2>Projects</h2>
          <button onClick={fetchProjects}>Refresh Projects</button>
          <ul>
            {projects.map((p) => (
              <li key={p.id}>
                <strong>{p.title}</strong> - {p.description}
              </li>
            ))}
          </ul>

          <h3>Add Project</h3>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={handleAddProject}>Add Project</button>
        </>
      )}
    </div>
  );
}

export default App;