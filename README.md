# MyESI Frontend

> **Enterprise Software Inventory (SBOM Platform) — Admin Portal**

## 🚀 Features
- Login & Authentication (mock, role-based)
- Admin Dashboard (stats, recent activity, trends)
- User Management (CRUD, filters, search, pagination)
- Role-based Dashboards (static for Analyst, Auditor, Developer)
- Professional sidebar navigation (blue/green/black palette)
- Responsive, modern UI (React 18 + Vite)

---

## 🛠️ Getting Started

### 1. **Clone the Repository**
```sh
# Clone the repo
git clone https://github.com/binteaqeel/myESI-frontend-.git
cd myESI-frontend-
```

### 2. **Install Dependencies**
```sh
npm install
```

### 3. **Run the Development Server**
```sh
npm run dev
```
- The app will be available at: [http://localhost:5173](http://localhost:5173)

### 4. **Build for Production**
```sh
npm run build
```
- Output in `dist/` folder

### 5. **Preview Production Build**
```sh
npm run preview
```

---

## 🔑 Demo Accounts
- **Admin:** `admin@myesi.com` / `demo123`
- **Analyst:** `analyst@myesi.com` / `demo123`
- **Auditor:** `auditor@myesi.com` / `demo123`
- **Developer:** `dev@myesi.com` / `demo123`

---

## 📦 Tech Stack
- React 18 + Vite
- React Router v6+
- Formik + Yup (forms & validation)
- Axios + React Query (@tanstack/react-query)
- Context API (auth)
- Mock services (auth, users, dashboard)
- ESLint (linting)

---

## 📝 Project Structure
```
myESI-frontend-
├── public/
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── utils/
│   └── assets/
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

---

## ⚡ Useful Scripts
- `npm run dev` — Start dev server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint

---

## ❓ Troubleshooting
- If you see errors on `npm run dev`, ensure Node.js (v18+) and npm are installed.
- Delete `node_modules` and `package-lock.json` and run `npm install` if issues persist.
- For Windows: Use PowerShell or Git Bash for best compatibility.

---

## 📄 License
This project is for educational/demo purposes only.

---

## Deliverables (Week 1)

✅ Login Page
✅ Admin Dashboard
✅ User Management Page
✅ Role-based Dashboards (Static)
