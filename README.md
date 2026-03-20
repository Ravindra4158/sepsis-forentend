# SepsisShield AI — Frontend

React 18 + Vite frontend for the AI-Based Early Sepsis Detection System.

## Features

- **Real-time Monitoring**: Live dashboard for ICU patients with continuous streaming of vital signs via WebSockets.
- **AI Sepsis Detection**: Early warning system using machine learning predictions, categorized into Risk Levels (CRITICAL, HIGH, MODERATE, LOW).
- **Role-Based Access Control (RBAC)**: Distinct interfaces for Doctors, Nurses, and Administrators, ensuring proper access and workflows.
- **Interactive Data Visualization**: Comprehensive charts for Heart Rate, Temperature, Respiratory Rate, Blood Pressure, and Sepsis Risk Score using Recharts.
- **Alert Management**: Real-time critical alerts requiring immediate medical attention.

## Quick Start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run preview    # preview production build
```

## Environment Variables

Copy `.env` and set:

```
VITE_API_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000/ws
```

## Tech Stack

- **Framework**: React 18, Vite
- **Routing**: React Router DOM (v6)
- **State Management**: React Context API, custom global UI store
- **Styling**: Vanilla CSS with Design Tokens
- **Charts/Visualization**: Recharts
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## Role-Based Access Control

| Feature              | Doctor | Nurse | Admin |
|----------------------|--------|-------|-------|
| View patients        | ✅     | ✅    | ✅    |
| View risk score      | ✅     | ✅    | ❌    |
| Update vitals        | ❌     | ✅    | ❌    |
| Add patient          | ✅     | ❌    | ❌    |
| Acknowledge alerts   | ✅     | ✅    | ❌    |
| Manage users         | ❌     | ❌    | ✅    |
| Configure system     | ❌     | ❌    | ✅    |

## Project Structure

```
src/
├── assets/styles/      # CSS design tokens + global styles
├── components/
│   ├── alerts/         # AlertCard, AlertList, AlertNotification
│   ├── charts/         # HR, Temp, Resp, BP, SepsisRisk charts
│   ├── common/         # Button, Modal, Loader, StatusBadge, Toast
│   ├── dashboard/      # RiskSummaryCards, PatientStats, ICUStatus, RecentAlerts
│   ├── forms/          # LoginForm, AddVitalsForm, UserForm
│   ├── layout/         # Navbar, Sidebar, Footer, PageContainer
│   └── patient/        # PatientCard, PatientTable, PatientVitals, PatientSearch
├── context/            # AuthContext, AlertContext, PatientContext
├── hooks/              # useAuth, useAlerts, usePatients, useVitals
├── pages/
│   ├── auth/           # Login, ForgotPassword
│   ├── dashboard/      # DoctorDashboard, NurseDashboard, AdminPanel
│   ├── patients/       # Patients, AddPatient, PatientDetails
│   ├── vitals/         # AddVitals
│   ├── alerts/         # Alerts
│   ├── users/          # Users, AddUser
│   └── settings/       # Settings
├── routes/             # AppRoutes, ProtectedRoute (RBAC-gated)
├── services/           # api, auth, patient, vitals, alert, user
├── store/              # Global UI state
└── utils/              # rbac, constants, formatDate, riskColor, validators
```

## Integration Flow

1. **Authentication**: `AuthContext` manages JWT tokens stored locally. Restricted API calls interceptable by Axios to include the `Authorization: Bearer <token>` header.
2. **REST API**: Fetches historical data, patient records, users, and handles form submissions (updating vitals, configuring the system).
3. **WebSockets**: `AlertContext` connects to `VITE_WS_URL` to receive instantaneous pushes of new `CRITICAL` or `HIGH` risk alerts, ensuring immediate notification without polling.

## License

This project is proprietary and confidential.
