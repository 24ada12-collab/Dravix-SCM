# DRAVIX SCM — Agricultural Supply Chain Management

AI-Assisted Agricultural Supply Chain Management System built fresh during the Buildathon.

---

## 📌 Project Overview
**DRAVIX SCM** is an agricultural supply-chain management platform designed to connect farmers, warehouse managers, logistics operators, and buyers with transparent, real-world storage, e-NWR eligibility, and market dispatch workflows.

> **Buildathon Implementation Note:**  
> This project is created completely fresh for the Buildathon build-day. No code or Git history has been copied, cloned, or transplanted from prior repositories. Features are developed and verified incrementally in stages.

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS (custom DRAVIX agricultural palette)
- **Routing**: React Router v7
- **Networking**: Axios
- **Icons**: Lucide React

### Backend
- **Language**: Java 21 LTS
- **Framework**: Spring Boot 3.3.4
- **Security**: Spring Security (stateless API configuration)
- **Data Persistence**: Spring Data JPA / Hibernate (configured for MySQL 8+)
- **Build Tool**: Maven

### Database
- **Engine**: MySQL 8.0+ (Local instance)
- **Database Name**: `dravix_scm`
- **Cloud/AWS**: None (Zero AWS services used; strictly local development stack)

---

## 🎨 Theme Palette
DRAVIX adheres to an agricultural green color system:
- **Background**: `#E8F5E9` (Soft green canvas)
- **Light Accent**: `#A5D6A7` (Borders, subtle cards)
- **Primary Accent**: `#66BB6A` (Interactive actions, badges)
- **Primary Dark**: `#1B5E20` (Headers, brand elements, primary emphasis)

---

## 📁 Project Structure

```
dravix-scm/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   └── SetupScreen.jsx       # Stage 1 Verification screen
│   │   ├── services/
│   │   │   └── api.js                # Axios client & health check
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css                 # Theme variables & Tailwind directives
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/dravix/scm/
│   │   │   │   ├── config/           # Security & CORS configuration
│   │   │   │   ├── controller/       # REST controllers (HealthController)
│   │   │   │   ├── dto/              # Data Transfer Objects (HealthResponse)
│   │   │   │   ├── entity/           # Future JPA entities
│   │   │   │   ├── exception/        # Exception handlers
│   │   │   │   ├── repository/       # Data repositories
│   │   │   │   ├── service/          # Business logic services
│   │   │   │   └── DravixScmApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties # Local MySQL & JPA settings
│   ├── .env.example
│   └── pom.xml
│
├── .gitignore
└── README.md
```

---

## 🚀 Local Development Setup

### Prerequisites
1. **Node.js**: v18+ or v20+ / v24+
2. **Java JDK**: 21+
3. **Apache Maven**: 3.9+
4. **MySQL Server**: 8.0+ running locally on port 3306

---

### 1. Database Setup
Ensure your local MySQL service is running and create the database (or let Spring Boot create it automatically):
```sql
CREATE DATABASE IF NOT EXISTS dravix_scm;
```
Configure your credentials in `backend/.env.example` or pass them via environment variables:
- `DB_URL`: `jdbc:mysql://localhost:3306/dravix_scm?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true`
- `DB_USERNAME`: `root`
- `DB_PASSWORD`: `<your-local-password>`

---

### 2. Backend Startup
From the project root:
```bash
cd backend
mvn spring-boot:run
```
The backend server starts on port `8080`.  
Verify health check:
```bash
curl http://localhost:8080/api/health
```
Response:
```json
{
  "status": "UP",
  "application": "DRAVIX SCM",
  "timestamp": "2026-10-05T..."
}
```

---

### 3. Frontend Startup
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
The frontend is served at: `http://localhost:5173`

---

## 📋 Build Status & Milestones

- [x] **Stage 1 — Project Scaffolding**: Setup fresh React + Vite + Tailwind frontend, Spring Boot 3 + Java 21 backend, theme tokens, health endpoint, verified full end-to-end local connectivity.
- [ ] **Stage 2 — Database + Backend Configuration**: *Pending instruction*
- [ ] **Stage 3 — Authentication & Roles**: *Pending instruction*
- [ ] **Stage 4 — Farmer Module**: *Pending instruction*
- [ ] **Stage 5 — Warehouse Discovery & Storage Workflow**: *Pending instruction*
- [ ] **Stage 6 — Product & Inventory Management**: *Pending instruction*
- [ ] **Stage 7 — Marketplace**: *Pending instruction*
- [ ] **Stage 8 — Order Workflow**: *Pending instruction*
- [ ] **Stage 9 — Logistics Workflow**: *Pending instruction*
- [ ] **Stage 10 — Recommendation Engine**: *Pending instruction*
- [ ] **Stage 11 — Dashboards & Analytics**: *Pending instruction*
- [ ] **Stage 12 — Final UI Polish**: *Pending instruction*
