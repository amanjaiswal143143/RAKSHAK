<div align="center">

  <img src="https://capsule-render.vercel.app/api?type=waving&color=ef4444&height=200&section=header&text=RAKSHAK&fontSize=70&fontColor=ffffff&animation=fadeIn" alt="Rakshak Header">

  <br>

  [![Typing SVG](https://readme-typing-svg.demolab.com?font=Inter&weight=700&size=24&pause=1000&color=EF4444&center=true&vCenter=true&width=500&lines=The+Silent+SOS.;Visual+Triage+Intelligence.;Last+Known+Path+Recovery.;Zero-Friction+Emergency+Response.)](https://git.io/typing-svg)

  <p align="center">
    <b>The AI-Powered "Black Box" for Human Safety in the BIMSTEC Region.</b><br>
    <i>Developed for the Centre of Excellence for Road Safety (CoERS), IIT Madras Hackathon 2026.</i>
  </p>

  <img src="https://img.shields.io/badge/IIT_Madras-Hackathon-0f172a?style=for-the-badge" alt="IIT Madras">
  <img src="https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase">
  
  <br><br>
</div>

> **🚨 The Golden Hour Crisis:** Traditional emergency apps fail during high-stress road accidents due to acoustic chaos (wind/sirens breaking Voice-AI) and false positives (dropped phones triggering alarms). **Rakshak** bypasses these flaws with a frictionless, haptic-first web platform that demands zero cognitive load and provides instant visual context to trauma teams.

---

## ✨ Core Innovations

### 📱 1. The "Silent SOS" Trigger
**Designed for chaos.** We scrapped voice assistants and typing entirely. Rakshak uses a massive, high-contrast haptic swipe slider. 
* **100% Intent Certainty:** Eliminates accidental pocket-dials and automated false positives.
* **Zero-Friction:** Works silently, requiring no cognitive load from panicked victims.

### 📸 2. Automated Visual Triage
**Context before arrival.** The absolute millisecond the SOS slider is swiped, Rakshak executes a rapid, silent background routine.
* **Front Camera:** Captures driver consciousness and injuries.
* **Rear Camera:** Captures vehicle and road damage.
* *This visual intelligence is attached to the SOS payload and sent to the trauma center instantly.*

### 📡 3. Last Known Path Recovery (LKPR)
**A digital "Black Box".** Rakshak continuously logs the user's GPS breadcrumb trail locally. 
* If a car rolls into a valley and loses signal, or the phone is crushed, rescue teams can reconstruct the trajectory from the last cloud-synced coordinate.

---

## 📸 Interface Preview

<div align="center">
  <img src="https://placehold.co/250x500/0f172a/ef4444?text=Slide+to\nSOS" alt="SOS Trigger" width="30%">
  <img src="https://placehold.co/250x500/0f172a/3b82f6?text=Visual\nTriage" alt="Visual Triage" width="30%">
  <img src="https://placehold.co/250x500/0f172a/22c55e?text=Live\nDispatch" alt="Map View" width="30%">
</div>

---

## ⚙️ System Architecture

Our tech stack is optimized for speed, offline resilience, and immediate deployment.

| Domain | Technology | Implementation |
| :--- | :--- | :--- |
| **Frontend** | React.js + Vite | Lightning-fast DOM rendering with a custom Tailwind "Emergency Dark" high-contrast theme. |
| **Backend** | Supabase (PostgreSQL) | Real-time insert operations and spatial data querying. |
| **GIS / Mapping** | Leaflet.js + HTML5 API | Real-time proximity matching to find the nearest BIMSTEC trauma center (Haversine formula). |
| **Identity** | Anonymous Session IDs | **Zero Login Wall.** We use local storage. Friction is fatal during trauma; we bypassed Auth entirely. |

---

## 🚀 Quick Start (Local Setup)

To run the Rakshak Stage 1 Prototype locally on your machine:

```bash
# 1. Clone the repository
git clone [https://github.com/amanjaiswal143143/RAKSHAK.git](https://github.com/amanjaiswal143143/RAKSHAK.git)
cd RAKSHAK

# 2. Install dependencies
npm install

# 3. Configure Environment Variables
# Create a .env file and add your Supabase credentials:
echo "VITE_SUPABASE_URL=your_url" >> .env
echo "VITE_SUPABASE_ANON_KEY=your_key" >> .env

# 4. Fire up the development server
npm run dev
