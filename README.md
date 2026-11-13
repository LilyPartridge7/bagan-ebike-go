#  Bagan E-Bike Go (ပုဂံ အီးဘိုက်)

> **Smart E-Bike Rental, Mobile Payments & GPS Roadside Rescue in Bagan, Myanmar**

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-green.svg)](https://leafletjs.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-orange.svg)](https://web.dev/progressive-web-apps/)

**Bagan E-Bike Go** is a responsive, mobile-first Progressive Web App (PWA) engineered for tourists and locals exploring the ancient temples and stupas of the **Bagan Archaeological Zone** (Old Bagan, New Bagan, and Nyaung-U).

It replaces outdated paper logbooks and manual deposit systems with instant QR handlebar scanning, 30-second digital guest check-in, local Myanmar mobile wallet integration (KBZPay, WavePay, AYA Pay, CB Pay), real-time ride tracking, and a 24/7 one-tap **Bagan Roadside Rescue SOS** system.

---

##  Key Features

###  1. Rider Experience (Mobile-First)
- **Instant Handlebar QR Scanner:** Fast camera scanner via `html5-qrcode` with rear-camera autofocus, manual Bike ID fallback (e.g. `BGN-004`), and instant test-scan simulations.
- **Direct QR Deep-Linking:** Scanning a physical QR sticker pointing to `https://bagan-ebike-go.vercel.app/?bike=BGN-004` automatically bypasses the landing page and opens the check-in screen for that specific e-bike.
- **30-Second Digital Check-In:** Form capturing full name, phone number, preferred messaging platform (**WhatsApp, Telegram, or Viber**), Bagan hotel/guesthouse name (or NRC/passport), and Bagan Archaeological Zone heritage safety regulations agreement.
- **Transparent Rental Packages:**
  -  **Hourly Explorer:** `1,500 MMK/hr` (Quick sunrise temple hops)
  -  **Half-Day Bagan Tour:** `4,000 MMK` (4 hours — sunrise or sunset expeditions)
  -  **Full-Day Sunrise-to-Sunset:** `7,000 MMK` (12 hours unlimited access)
- **Flexible Multi-Payment Checkout:**
  - **MMQR / Local Wallets:** Displays dynamic payment QR for KBZPay, WavePay, AYA Pay, and CB Pay with transaction ID input and optional receipt screenshot upload preview.
  - **Station Cash Pay:** Reserve and pay in MMK or USD at the shop counter with instant pending status.
  - **International Card Mock:** One-click card simulator for international travelers.
- **Active Ride Dashboard:**
  - Live elapsed timer and running cost calculation.
  - **Live GPS Sharing Beacon:** Continuous location tracking via `navigator.geolocation.watchPosition()` sharing coordinates to the shop owner's live radar map.
  - **Bagan Rescue SOS:** One-tap emergency roadside dispatch with GPS pin generation, issue classification (*Low Battery*, *Flat Tire*, *Mechanical Failure*, *Lost in Pagoda Trails*), and direct phone/WhatsApp dispatch link.

---

###  2. Shop Owner & Admin Dashboard
- **Live Bagan Fleet Radar Map:** Interactive Leaflet map centered on Bagan (`21.1717° N, 94.8585° E`) displaying color-coded bike status pins:
  - 🟢 **Available:** Ready for rent at stations across Old Bagan, New Bagan, and Nyaung-U.
  - 🔵 **In Use:** Active ride with rider name and live GPS coordinates.
  - 🔴 **SOS Alert:** Pulsing red beacon with emergency alert details and direct rider contact.
  - 🟠 **Low Battery:** Flagged for battery swap (under 25%).
- **Verification Queue:** Review and approve pending MMQR receipts and cash payments, or scan returning bikes to automatically calculate overtime fees and return bikes to the available fleet.
- **Hardware GPS & Fleet Management:** Seeded fleet (`BGN-001` through `BGN-015`), editable hardware GPS IMEI/Tracker fields (ready for 4G IoT tracker webhooks), and printable QR code sticker generation modal powered by `qrcode.react`.

---

###  3. Design & Bilingual Support
- **Visual Identity:** Warm terracotta, sandstone, and deep emerald palette reflecting Bagan's historic brick pagodas and bougainvillea flora.
- **Ambient Media:** High-contrast daylight interface layered over an ambient looping sunrise video (`/bagan-sunrise.mp4`) with an animated SVG pagoda and hot-air balloon fallback.
- **Bilingual Interface:** Instant one-click toggle between **English** and **မြန်မာဘာသာ (Myanmar)** across all rider flows and admin screens.
- **Offline Resilience:** LocalStorage persistence layer queuing ride logs and status updates even when cellular connectivity drops near remote monuments.

---

##  Tech Stack & Architecture

- **Core:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Build Tool:** [Vite 6](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Maps:** [Leaflet](https://leafletjs.com/) + [React-Leaflet](https://react-leaflet.js.org/)
- **QR Code Engine:** [html5-qrcode](https://github.com/mebjas/html5-qrcode) (scanner) + [qrcode.react](https://github.com/zpao/qrcode.react) (generator)
- **State & Storage:** Clean service layer backed by `localStorage` (schema-ready for Supabase or Firebase)

---

##  Steps to Run Locally

### Prerequisites
Make sure you have **Node.js** (v18.0.0 or higher) and **npm** installed on your computer.

Verify installation:
```bash
node -v
npm -v
```

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/bagan-ebike-go.git
cd bagan-ebike-go
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```

The app will start at `http://localhost:5173/` (or `http://127.0.0.1:5173/`).

### 4. Build for Production
To create an optimized production build:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

---

##  Testing URLs & Query Parameters

Once the dev server is running, you can test different app states by visiting:

| URL | Description |
| :--- | :--- |
| `http://localhost:5173/` | **Landing Page** with hero sunrise video, interactive rate calculator, and station fleet availability |
| `http://localhost:5173/?bike=BGN-004` | **Direct Rider Check-In** simulating a customer scanning bike `BGN-004` |
| `http://localhost:5173/?role=rider` | **Rider Mode** with camera QR scanner |
| `http://localhost:5173/?role=admin` | **Shop Owner Dashboard** with live Leaflet fleet map and payment verification queue |

---

##  Deployment to Vercel

The repository includes a pre-configured `vercel.json` with SPA route rewrites:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

### Deploying via GitHub & Vercel:
1. Push your repository to GitHub using **GitHub Desktop** or the CLI.
2. Go to [Vercel Dashboard](https://vercel.com/) and click **"Add New Project"**.
3. Select your `bagan-ebike-go` repository.
4. Verify the Framework Preset is set to **Vite** (Build command: `npm run build`, Output directory: `dist`).
5. Click **Deploy**. Your app will be live with full deep-linking support!

---
