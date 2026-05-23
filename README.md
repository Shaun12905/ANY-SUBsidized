SUBsidized 💸
> Kill your subscriptions. A subscription tracker and AI-powered cancellation tool built for Malaysian university students on tight budgets.

🚀 Quick Start

bash
1. Clone / unzip the project
cd subsidized

2. Install dependencies
npm install

3. Set up environment 
cp .env.example .env
Edit .env and add your Gemini API key from:
https://aistudio.google.com/app/apikey

4. Run dev server
npm run dev

Open http://localhost:5173 in your browser.

🏗️ Project Structure

subsidized/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── EconomyHeader.jsx      # Top bar: profile + animated counters
│   │   ├── KillSwitchModal.jsx    # Overlay: Gemini AI + cancel redirect
│   │   ├── RealityToggle.jsx      # CSS cross-fade price ↔ plates
│   │   ├── SmartSwap.jsx          # Free alternative reveal panel
│   │   └── SubscriptionCard.jsx   # Main bento card
│   ├── data/
│   │   └── subscriptions.js       # All subscription config + fallback scripts
│   ├── hooks/
│   │   └── useGeminiRetention.js  # Gemini API hook with fallback logic
│   ├── utils/
│   │   └── icsGenerator.js        # Blob API → .ics file download
│   ├── App.jsx                    # Root component + global state
│   ├── index.css                  # Tailwind + custom animations
│   └── main.jsx                   # React entry point
├── index.html
├── .env.example
├── .gitignore
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js


📄 Tech Stack
React 18 + Vite 5 — fast HMR dev environment
Tailwind CSS 3 — utility-first styling
Lucide React — clean icon set
Google Gemini 1.5 Flash — AI retention scripts (free tier)
CSS Keyframes — Reality Toggle animation (zero JS timers)

Built for Malaysian university students. No server. No tracking. Just savings.
