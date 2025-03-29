# 📁 React Client Structure - Project Guide

This document explains the structure and purpose of each folder and file in the **React client** of this project.

---

## 🚀 Getting Started

To start the React client:

```bash
cd client
npm install
npm start  # runs react-scripts start (as defined in package.json)
```

---

## 📦 Project Structure

```
client/
├── public/
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── images/
│   ├── pages/
│   ├── styles/
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.js
│   ├── index.css
│   ├── reportWebVitals.js
│   └── setupTests.js
└── package.json
```

---

## 🔍 Folder Breakdown

### `src/`
Main source code for the React app.

#### ▸ `App.js`
- **Entry point** of the app.
- Contains the root-level routes, context, and layout components.

#### ▸ `api/`
- (Alias used) Points to **`services/`** in description — contains **all API calls** to backend.
- Keeps the logic for HTTP requests separate and reusable.

#### ▸ `assets/`
- Holds **static files** like logos, animations (e.g. Lottie JSON), or background images.
- These files can be imported anywhere across the app.

#### ▸ `components/`
- Reusable **React components** like cards, buttons, headers, forms, etc.
- Used by pages to maintain modularity and consistency.

#### ▸ `context/`
- Stores **React Context** definitions (e.g., UserContext) for global state management.

#### ▸ `images/`
- Dedicated to **images used in the UI**, such as doctor profile photos, background illustrations, etc.

#### ▸ `pages/`
- Each **individual route/page** (like Login, Register, Dashboard, Schedule, etc.) lives here.
- Pages import components and styles as needed.

#### ▸ `styles/`
- Contains all **custom CSS files**, often scoped to specific components or pages.
- Promotes separation of styles from logic.

---

## 🧪 Tests & Utilities

- `App.test.js` – Unit tests for App component
- `reportWebVitals.js` – Optional performance tracking tool
- `setupTests.js` – Configuration for testing libraries (e.g., Jest, React Testing Library)

---

## 📝 Additional Notes

- The app uses **`react-scripts`** under the hood for bundling and running.
- You can add environment variables in a `.env` file inside `client/`.
- Most static and visual assets should be kept in `assets/` or `images/`.

---

