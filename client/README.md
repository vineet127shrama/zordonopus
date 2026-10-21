# 🚨 ZordonOps – Real-Time Incident Management System

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/UI-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![RBAC Supported](https://img.shields.io/badge/Security-Multi--Tenant_RBAC-red?style=for-the-badge)
![SLA Engine](https://img.shields.io/badge/Engine-SLA_Tracking-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

> **ZordonOps** is a mission-critical command center platform engineered for DevOps, SRE, and IT operations teams to detect, triage, assign, track, and resolve system incidents in real-time. Built with a **Black & Bold** operational aesthetic for high-stress monitoring environments.

---

## ✨ Key Features

- ⚡ **Real-Time SLA Engine:** Dynamic countdown timers for incident response and resolution with automated SLA breach escalation logic.
- 🔒 **Multi-Tenant RBAC Security:** Strict Role-Based Access Control (`Admin`, `Resolver`, `Viewer`) powered by JWT authentication and secure password hashing.
- 💻 **Command Center Dashboard:** High-contrast, dark-mode UI built with React and Tailwind CSS optimized for fast incident triage and operational clarity.
- 🛠️ **RESTful Lifecycle Management:** Complete ticket lifecycle workflows including incident creation, assignment, priority escalation, and root-cause analysis tags.
- 📊 **Analytics & Metrics:** Real-time visibility into Mean Time to Respond (MTTR), active SLA breaches, and workload distribution across resolvers.

---

## 🛠️ Tech Stack

### **Frontend**
- **React.js** (Vite build tool)
- **Tailwind CSS** (Command Center Black & Bold UI)
- **Axios** (API Requests)

### **Backend**
- **Node.js** & **Express.js** (REST API Architecture)
- **MongoDB** & **Mongoose** (Multi-tenant data modeling)
- **JSON Web Tokens (JWT)** & **Bcrypt.js** (Authentication & Security)

---

## 📂 Project Structure

```text
zordonopus/
├── server/                 # Express backend API server
│   ├── controllers/        # Auth & Incident request handlers
│   ├── models/             # Mongoose schemas (User, Issue)
│   ├── routes/             # RESTful API route definitions
│   └── package.json
└── client/                 # React frontend client
    ├── public/             # Static assets & icons
    ├── src/
    │   ├── assets/         # Images & vectors
    │   ├── components/     # Reusable UI elements
    │   └── pages/          # Dashboard, Landing, Login, Signup
    └── package.json