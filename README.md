<div align="center">
  <img src="https://img.shields.io/badge/RAKSHAK-ROAD_SAFETY-ef4444?style=for-the-badge&logo=shield" alt="Rakshak Logo" height="60">

  <br />
  <br />

  <img src="https://img.shields.io/badge/IIT_Madras-Hackathon_2026-0f172a?style=flat-square&logo=codeforces" alt="Hackathon Badge" />
  <img src="https://img.shields.io/badge/React-Vite-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Status-Stage_1_Prototype-blue?style=flat-square" alt="Status" />

  <h1 align="center">🚨 Rakshak: The Silent SOS</h1>
  <p align="center">
    <b>The AI-Powered "Black Box" for Human Safety in the BIMSTEC Region.</b>
    <br />
    <i>Developed for the Centre of Excellence for Road Safety (CoERS), IIT Madras.</i>
  </p>

  <p align="center">
    <a href="#-the-mission">Mission</a> •
    <a href="#-core-innovations">Features</a> •
    <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Setup</a> •
    <a href="#-ethics--future-scope">Future Scope</a>
  </p>
</div>

---

> **🏆 Hackathon Track:** Theme 1: AI in Road Safety (RoadSoS)
> **🎯 Objective:** Provide instant, location-based access to nearby trauma centers, ambulances, police stations, and vehicle rescue during road accidents.

## 🌍 The Mission

In the critical "Golden Hour" following a severe road accident, traditional emergency triggers fail. Voice-AI breaks down in acoustic chaos (wind, sirens, panic). Automated hardware sensors trigger dangerous false positives (dropped phones, overheating). 

**Rakshak** bypasses these flaws. We engineered a haptic-first, silent SOS web application that instantly dispatches emergency services while providing automated visual context to trauma teams—requiring zero cognitive load from the victim.

---

## ✨ Core Innovations

<table>
  <tr>
    <td width="60%">
      <h3>📱 1. Silent SOS (Haptic Trigger)</h3>
      <p>Designed for chaos. We replaced unreliable voice assistants and complex typing with a massive, high-contrast swipe slider. This guarantees 100% intent certainty, eliminates false positives, and works silently.</p>
    </td>
    <td width="40%" align="center">
      <i>[Drop your SOS UI Screenshot here]</i><br>
      <code>![SOS UI](assets/sos-slider.png)</code>
    </td>
  </tr>
  <tr>
    <td width="60%">
      <h3>📸 2. Automated Visual Triage</h3>
      <p>The millisecond the SOS is swiped, Rakshak executes a rapid, sequential background capture of the <b>Front Camera</b> (driver consciousness) and <b>Rear Camera</b> (vehicle/road damage), sending instant visual intelligence to hospitals before dispatch.</p>
    </td>
    <td width="40%" align="center">
      <i>[Drop your Triage Screenshot here]</i><br>
      <code>![Triage UI](assets/triage.png)</code>
    </td>
  </tr>
  <tr>
    <td width="60%">
      <h3>📡 3. Last Known Path Recovery (LKPR)</h3>
      <p>Operating as a digital "Black Box," Rakshak continuously logs the user's GPS trail locally. If the device is crushed or loses network in a remote valley, search teams can reconstruct the trajectory from the last cloud-synced point.</p>
    </td>
    <td width="40%" align="center">
      <i>[Drop your Map Screenshot here]</i><br>
      <code>![Map UI](assets/map.png)</code>
    </td>
  </tr>
</table>

---

## 🛠️ Tech Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | **React (Vite) + Tailwind CSS** | High-performance, mobile-first "Emergency Dark" interface. |
| **Backend & DB** | **Supabase (PostgreSQL)** | Real-time active SOS request logging and spatial querying. |
| **Mapping / GIS** | **Leaflet.js + HTML5 API** | Real-time geolocation and dynamic emergency service routing. |
| **Local Resilience** | **IndexedDB / LocalStorage** | Offline LKPR path caching and zero-friction session management. |

---

## 🚀 Getting Started

Want to test the Rakshak prototype locally? Follow these steps:

### 1. Clone & Install
```bash
git clone [https://github.com/your-username/rakshak-roadsos.git](https://github.com/your-username/rakshak-roadsos.git)
cd rakshak-roadsos
npm install
