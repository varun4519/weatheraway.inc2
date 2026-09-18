# WeatherAway.Inc 🌤️

WeatherAway.Inc is a modern, responsive single-page weather intelligence application built with React, TypeScript, and Tailwind CSS. It leverages Open-Meteo's public APIs to deliver real-time weather observations, interactive 7-day temperature trends, dynamic planning recommendations, active hazard alerts, and fluid autocomplete location searches.

---

## Features

- **Autocomplete City Search & Recommendations**: Real-time debounce querying via Open-Meteo Geocoding API with multi-location disambiguation (city, state/province, country).
- **Recent Searches History**: Persists up to 5 recently queried cities in browser `localStorage` for instant one-click access.
- **Current Weather Intelligence**: Detailed metrics including current temperature, apparent temperature, relative humidity, wind speed, and condition descriptions with day/night icon variations.
- **Weather Alerts**: Automatic detection of hazardous weather flags (extreme heat, freezing temperatures, high winds, severe thunderstorms, heavy snow, freezing rain).
- **Dynamic Planning Recommendations**: Contextual daily tips (e.g. umbrella reminders, heat advisories, layered clothing suggestions) based on retrieved forecast metrics.
- **7-Day Forecast & Interactive Chart**: Area trend visualization powered by Recharts, paired with staggered, interactive daily forecast cards with hover elevation.
- **Unit Switching**: Dynamic toggle between Celsius (°C) and Fahrenheit (°F) with instantaneous recalculation across all panels.
- **Atmospheric Background Animations**: Subtle CSS ambient pulses reflecting current sky conditions (sunny warmth, rain wash, cool snow, or stormy tones).

---

## Tech Stack

- **Framework**: React 19 with Vite & TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: `motion` (Framer Motion)
- **Visualizations**: Recharts
- **Icons**: Lucide React
- **Date Formatting**: date-fns
- **APIs**:
  - Open-Meteo Geocoding API: `https://geocoding-api.open-meteo.com/v1/search`
  - Open-Meteo Forecast API: `https://api.open-meteo.com/v1/forecast`

---

## Local Development

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, pnpm, or bun

### Setup Steps

1. Clone or extract the repository:
   ```bash
   git clone <your-repo-url>
   cd weatheraway-inc
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) (or the displayed port) in your browser.

4. Build for production:
   ```bash
   npm run build
   ```
   The compiled static assets will be output to the `dist/` directory.

---

## Exporting from Google AI Studio to GitHub

To move your project from Google AI Studio into a GitHub repository:

### Method 1: Using AI Studio's Built-in Export (Recommended)

1. In the Google AI Studio interface, locate the top navigation header.
2. Click the **Export** or **Settings** menu (top-right corner).
3. Select **Export to GitHub**.
4. Authorize Google AI Studio with your GitHub account if prompted.
5. Enter a repository name (e.g., `weatheraway-inc`) and choose whether the repository should be public or private.
6. Click **Confirm / Export**. AI Studio will automatically create the repository and push your application code.

### Method 2: Export as ZIP & Push via Git CLI

1. In Google AI Studio, click the menu in the top-right corner and select **Download as ZIP** / **Export ZIP**.
2. Unzip the downloaded archive on your computer.
3. Open your terminal, navigate to the unzipped project folder, and initialize Git:
   ```bash
   cd weatheraway-inc
   git init
   git add .
   git commit -m "Initial commit from Google AI Studio"
   ```
4. Create a new repository on [GitHub](https://github.com/new).
5. Link your local project to the GitHub remote repository and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git
   git push -u origin main
   ```

---

## Cloudflare Pages Deployment Instructions

WeatherAway.Inc is a purely client-side Single Page Application (SPA) with zero external secret keys required, making it an ideal fit for Cloudflare Pages.

### Option 1: Deploy via Cloudflare Dashboard (Continuous Deployment)

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the sidebar, navigate to **Compute (Workers & Pages)** > **Pages**.
3. Click **Create a project** > **Connect to Git**.
4. Select your GitHub account and choose the repository you exported (`weatheraway-inc`).
5. Configure the build settings:
   - **Project name**: `weatheraway` (or your preferred subdomain)
   - **Production branch**: `main`
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version (Environment variable, optional)**: Add `NODE_VERSION` = `20` under Environment Variables if required.
6. Click **Save and Deploy**.
7. Cloudflare will automatically build and publish your application. Any future pushes to your `main` branch on GitHub will trigger automatic preview and production deployments.

> **Note on SPA Routing**: A `public/_redirects` file is included in this repository with `/* /index.html 200` to ensure that direct navigation or browser refreshes work seamlessly on Cloudflare Pages.

---

### Option 2: Deploy using Wrangler CLI

If you prefer deploying directly from your local terminal using the Cloudflare Wrangler CLI:

1. Install Wrangler globally or run via `npx`:
   ```bash
   npm install -g wrangler
   ```

2. Log in to your Cloudflare account:
   ```bash
   wrangler login
   ```

3. Build the application for production:
   ```bash
   npm run build
   ```

4. Deploy the `dist` directory:
   ```bash
   wrangler pages deploy dist --project-name=weatheraway-inc
   ```
   Follow the CLI prompts to select or create the project. Wrangler will upload the static assets and output your live deployment URL.

---

## License

This project is licensed under the Apache-2.0 License.
