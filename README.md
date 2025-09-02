# 🚀 Matick Beacon — Setup & Deployment Guide

Welcome to **Matick Beacon**. This project has a backend (Node + Express + PostgreSQL) and frontend (React). Everything is deployed on **Render.com**.  

Follow these steps exactly (all commands are copy‑and‑paste‑ready).  

---

## 🔹 1. Clone Repos Locally

Open your terminal and run:  
```bash
# Go to Desktop
cd ~/Desktop

# Clone backend
git clone https://github.com/justindinatale/Matick-beacon.git
cd Matick-beacon
npm install

# Return to Desktop
cd ..

# Clone frontend
git clone https://github.com/justindinatale/matick-beacon-frontend.git
cd matick-beacon-frontend
npm install
```

---

## 🔹 2. Backend

Backend is already live:  
```
https://matick-beacon.onrender.com
```

If you want to run locally:  
```bash
cd ~/Desktop/Matick-beacon
npm start
```

It will start at:  
```
http://localhost:5000
```

---

## 🔹 3. Database

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Projects Table
```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

👉 Already set up on Render (`matick-beacon-db`).  

---

## 🔹 4. Frontend Local Dev

```bash
cd ~/Desktop/matick-beacon-frontend
npm start
```

Visit:  
```
http://localhost:3000
```

---

## 🔹 5. Frontend Deployment on Render

1. Go to [Render Dashboard](https://render.com/dashboard)  
2. Click **New → Static Site**  
3. Link repo: `justindinatale/matick-beacon-frontend`  
4. Fill in settings:  
   - **Name:** `matick-beacon-frontend`  
   - **Build Command:**  
     ```bash
     npm install && npm run build
     ```  
   - **Publish Directory:**  
     ```
     build
     ```  
5. Click **Create Static Site**  

👉 Render gives you final URL:  
```
https://matick-beacon-frontend.onrender.com
```

---

## 🔹 6. API Testing Toolkit (cURL)

### Register
```bash
curl -X POST https://matick-beacon.onrender.com/auth/register   -H "Content-Type: application/json"   -d '{"email":"testuser@example.com","password":"mypassword"}'
```

### Login
```bash
curl -X POST https://matick-beacon.onrender.com/auth/login   -H "Content-Type: application/json"   -d '{"email":"testuser@example.com","password":"mypassword"}'
```

### Get Projects
```bash
curl https://matick-beacon.onrender.com/projects   -H "Authorization: Bearer YOUR_JWT_HERE"
```

### Add Project
```bash
curl -X POST https://matick-beacon.onrender.com/projects   -H "Authorization: Bearer YOUR_JWT_HERE"   -H "Content-Type: application/json"   -d '{"title":"Demo Project","description":"Created via curl"}'
```

---

# ✅ Current State
- Backend: Live  
- DB: Live  
- Auth: Working (JWT)  
- Frontend: Repo ready, local runs fine  
- Next Step: Deploy frontend on Render  

---
