<div align="center">

  <img src="https://via.placeholder.com/1200x300/0f172a/ef4444?text=[DROP+YOUR+MAIN+RAKSHAK+BANNER+IMAGE+HERE]" alt="Rakshak Banner" width="100%">

  <br><br>

  <img src="https://img.shields.io/badge/IIT_Madras-Hackathon_2026-0f172a?style=for-the-badge&logo=codeforces" alt="Hackathon Badge" />
  <img src="https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/BIMSTEC-RoadSoS-ef4444?style=for-the-badge" alt="BIMSTEC" />

  <h1 align="center">🚨 RAKSHAK: The Silent SOS App</h1>
  <p align="center">
    <b>The AI-Powered "Black Box" for Human Safety in the BIMSTEC Region.</b>
    <br />
    <i>Developed for the Centre of Excellence for Road Safety (CoERS), IIT Madras.</i>
  </p>

  <p align="center">
    <a href="#-the-crisis">The Crisis</a> •
    <a href="#-core-innovations">Features & UI</a> •
    <a href="#%EF%B8%8F-system-architecture">Architecture</a> •
    <a href="#-installation">Setup</a> •
    <a href="#-the-squad">Meet the Team</a>
  </p>
</div>

---

## 🩸 The Crisis: The "Golden Hour"
In the event of a catastrophic road traffic accident, the first 60 minutes are the difference between life and death. Traditional emergency apps fail in these high-stress environments:
1. **Acoustic Chaos:** Wind, sirens, and panic make Voice-AI and NLP completely useless. 
2. **False Positives:** Automated crash sensors trigger fake alarms when a phone is dropped or overheats on a dashboard.
3. **Context Blindness:** Emergency responders arrive blind, not knowing if they need a standard ambulance or heavy extraction tools.

> **Rakshak** bypasses all of this. We engineered a haptic-first, frictionless web platform that demands zero cognitive load, eliminates false positives, and provides instant visual context to trauma teams.

---

## ✨ Core Innovations & UI Flow

<table width="100%">
  <tr>
    <td width="60%">
      <h3>📱 1. The "Silent SOS" Trigger</h3>
      <p>Designed for acoustic chaos and shock. We scrapped voice assistants and typing entirely. Rakshak uses a massive, high-contrast haptic swipe slider. This guarantees <b>100% intent certainty</b> and eliminates the risk of accidental pocket-dials or automated false positives.</p>
    </td>
    <td width="40%" align="center">
      <img src="https://via.placeholder.com/300x500/1e293b/ef4444?text=[ADD+SOS+SLIDER+SCREENSHOT+HERE]" alt="SOS Trigger UI">
    </td>
  </tr>
  
  <tr>
    <td width="60%">
      <h3>📸 2. Automated Visual Triage</h3>
      <p>The absolute millisecond the SOS slider is swiped, Rakshak executes a rapid, silent background routine. It sequentially accesses the <b>Front Camera</b> (to capture driver consciousness/injuries) and the <b>Rear Camera</b> (to capture vehicle/road damage). This visual intelligence is sent to the trauma center instantly.</p>
    </td>
    <td width="40%" align="center">
      <img src="https://via.placeholder.com/300x500/1e293b/ef4444?text=[ADD+VISUAL+TRIAGE+SCREENSHOT+HERE]" alt="Visual Triage UI">
    </td>
  </tr>

  <tr>
    <td width="60%">
      <h3>📡 3. Last Known Path Recovery (LKPR)</h3>
      <p>A digital "Black Box" for smartphones. Rakshak continuously logs the user's HTML5 GPS breadcrumb trail locally. If the car rolls into a valley and loses signal, or the phone is crushed in the impact, rescue teams can reconstruct the trajectory from the last cloud-synced coordinate.</p>
    </td>
    <td width="40%" align="center">
      <img src="https://via.placeholder.com/300x500/1e293b/ef4444?text=[ADD+MAP+DISPATCH+SCREENSHOT+HERE]" alt="LKPR Map UI">
    </td>
  </tr>
</table>

---

## ⚙️ System Architecture

Our tech stack is optimized for **speed, offline resilience, and zero-friction.**

* **Frontend:** Built with `React.js` and `Vite` for lightning-fast DOM rendering. Styled with `Tailwind CSS` using a custom "Emergency Dark" high-contrast theme to reduce glare at night.
* **Backend:** Powered by `Supabase` (PostgreSQL) for real-time insert operations and spatial data querying.
* **GIS / Mapping:** `Leaflet.js` integrated with the `HTML5 Geolocation API` for real-time proximity matching (e.g., finding the nearest BIMSTEC trauma center using the Haversine formula).
* **Identity Management:** **Zero Login Wall.** We use anonymous `localStorage` session IDs. Friction is fatal during a trauma event, so we bypassed traditional Auth entirely.

---

## 🚀 Installation & Local Setup

Want to run the Rakshak prototype locally? Follow these steps:

**1. Clone the specific repository:**
```bash
git clone [https://github.com/amanjaiswal143143/RAKSHAK.git](https://github.com/amanjaiswal143143/RAKSHAK.git)
cd RAKSHAK
