<div align="center">

  <img src="https://capsule-render.vercel.app/api?type=waving&color=ef4444&height=200&section=header&text=RAKSHAK&fontSize=70&fontColor=ffffff&animation=fadeIn" alt="Rakshak Header">

  <br>

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Inter\&weight=700\&size=24\&pause=1000\&color=EF4444\&center=true\&vCenter=true\&width=500\&lines=The+Silent+SOS.;Visual+Triage+Intelligence.;Last+Known+Path+Recovery.;Zero-Friction+Emergency+Response.)](https://git.io/typing-svg)

  <p align="center">
    <b>Rakshak AI — The Intelligent Emergency Response & Road Safety Platform.</b><br>
    <i>Built for the IIT Madras CoERS Road Safety Hackathon 2026.</i>
  </p>

  <img src="https://img.shields.io/badge/IIT_Madras-CoERS-red?style=for-the-badge" alt="IIT Madras">
  <img src="https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase">
  <img src="https://img.shields.io/badge/PWA-Offline%20Ready-purple?style=for-the-badge" alt="PWA">

<br><br>

</div>

---

# 🚨 Problem Statement

Road accidents in BIMSTEC countries often suffer from delayed emergency response due to:

* lack of instant communication,
* weak internet connectivity,
* panic during emergencies,
* absence of real-time context for rescue teams,
* and high-friction emergency systems.

Traditional emergency apps fail because:

* Voice AI breaks in sirens/wind/noise,
* login systems waste critical time,
* and false-positive triggers reduce reliability.

Rakshak AI solves this with a frictionless, offline-resilient, mobile-first emergency response system optimized for the “Golden Hour”.

---

# 🧠 What is Rakshak AI?

Rakshak AI is an intelligent road safety and emergency response platform acting as a digital “Black Box” for human survival.

It combines:

* real-time emergency response,
* offline fallback systems,
* guardian live tracking,
* smart safety intelligence,
* and lightweight AI-based risk analysis

into a single ultra-fast emergency platform.

---

# ✨ Core Features

## 🚨 1. Silent One-Tap SOS

A massive swipe-based emergency trigger designed for high-stress situations.

### Features:

* One-swipe emergency activation
* Live GPS coordinates
* Emergency timestamp
* Instant backend sync
* Haptic-inspired UI feedback
* False-positive prevention
* Offline emergency backup

---

## 📸 2. Automated Visual Triage

The moment SOS is triggered:

* Front camera captures driver condition
* Rear camera captures vehicle damage
* Images are attached to emergency payload

This gives trauma centers visual context before arrival.

---

## 🛰️ 3. Last Known Path Recovery (LKPR)

Rakshak AI continuously stores lightweight GPS breadcrumbs locally.

### Benefits:

* Helps reconstruct movement trajectory
* Works during network failure
* Assists rescue teams in dead zones
* Acts like an aviation black box for vehicles

---

## 🌙 4. Night Safety Mode

After sunset Rakshak automatically:

* enlarges emergency buttons,
* increases contrast,
* reduces distractions,
* and prioritizes emergency actions.

Designed specifically for low-visibility conditions.

---

## ⚠️ 5. Unsafe Stop Detection

If:

* movement stops unexpectedly,
* it is nighttime,
* and location appears isolated,

Rakshak AI triggers:

* a safety countdown,
* “Are You Safe?” verification,
* and automatic SOS if ignored.

---

## 👨‍👩‍👧 6. Guardian Live Tracking

Users can:

* share temporary live trip links,
* allow guardians to track movement,
* and auto-expire links after journey completion.

No login required.

---

## 📶 7. Offline Emergency SMS Fallback

If internet fails:

* Rakshak automatically switches to emergency SMS mode,
* pre-fills location + emergency details,
* and allows rapid emergency transmission.

Critical for low-network regions.

---

## 🗺️ 8. Quick Nearby Help

Real-time lightweight map support for:

* Hospitals
* Police Stations
* Fuel Stations
* Towing Services

Built using:

* Leaflet.js
* OpenStreetMap
* optimized lightweight APIs

---

## 💾 9. Offline Rescue Mode

Rakshak AI supports offline micro-maps.

### Features:

* Offline emergency radius download
* Local map caching
* Dead-zone accessibility
* Nearby rescue discovery without internet

Powered using:

* IndexedDB
* Service Workers
* PWA caching
* OpenStreetMap tile storage

---

## 🤖 10. Rakshak AI Intelligence Layer

A lightweight AI-inspired safety engine.

### AI Capabilities:

* Risk scoring
* Smart emergency suggestions
* Isolation analysis
* Connectivity warnings
* Emergency prioritization

### Example:

* “You are entering a low network zone.”
* “Nearest trauma center is 2.1km away.”
* “Consider sharing live trip with guardian.”

---

# 📱 UI/UX Philosophy

Rakshak AI is designed for:

* panic situations,
* low-end Android devices,
* low internet regions,
* and high-speed emergency interaction.

### UX Principles:

* Zero login walls
* Zero typing during emergencies
* Mobile-first design
* Large thumb-friendly controls
* Dark emergency UI
* Fast one-handed usage
* Minimal cognitive load

---

# 🏗️ System Architecture

| Domain          | Technology                 | Purpose                          |
| :-------------- | :------------------------- | :------------------------------- |
| Frontend        | React.js + Vite            | Ultra-fast responsive interface  |
| Styling         | Tailwind CSS               | Emergency-focused modern UI      |
| Backend         | Supabase + PostgreSQL      | Realtime emergency storage       |
| Maps            | Leaflet.js + OpenStreetMap | Lightweight emergency GIS        |
| Offline Storage | IndexedDB + localStorage   | Offline resilience               |
| PWA             | Service Workers            | Offline emergency support        |
| AI Layer        | Rule-Based Safety Engine   | Lightweight intelligent analysis |

---

# ⚡ Performance Optimizations

Rakshak AI is optimized for:

* low battery usage,
* slow internet,
* unstable connectivity,
* and low-memory devices.

### Techniques Used:

* Debounced GPS tracking
* Lazy route loading
* Minimal re-renders
* Lightweight APIs
* Offline-first caching
* Optimized map tile loading

---

# 🌍 Target Impact

Rakshak AI is designed for deployment across BIMSTEC nations where:

* emergency infrastructure is inconsistent,
* rural connectivity is weak,
* and rapid response systems are limited.

The platform prioritizes:

* accessibility,
* speed,
* reliability,
* and offline survivability.

---

# 🚀 Local Development Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/amanjaiswal143143/RAKSHAK.git
cd RAKSHAK
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Configure Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 4️⃣ Run Development Server

```bash
npm run dev
```

---

# 📂 Project Structure

```bash
src/
├── components/
├── pages/
├── services/
├── hooks/
├── maps/
├── ai/
├── emergency/
├── offline/
├── store/
└── utils/
```

---

# 🔮 Future Scope

* AI accident severity estimation
* Smart ambulance routing
* Vehicle sensor integration
* Government emergency APIs
* Multi-language emergency support
* Wearable integration
* Crash prediction analytics

---

# 👨‍💻 Team Rakshak

Built with a mission to reduce emergency response delays and improve road safety outcomes through accessible technology.

---

<div align="center">

## ❤️ “Every Second Matters During the Golden Hour.”

### Rakshak AI — Protecting Lives Through Intelligent Emergency Response.

</div>
