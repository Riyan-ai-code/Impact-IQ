# ImpactIQ — Frontend Setup Guide

Follow this guide to get the ImpactIQ frontend up and running locally.

---

## 📋 Prerequisites

Ensure you have the following installed:
- **Node.js**: `v18.x` or higher (recommended: `v20.x`)
- **Package Manager**: `npm` (v10.x+) or `yarn` / `pnpm`

---

## ⚙️ Installation & Development

1. **Install Dependencies**:
   From the `frontend/` directory, install package dependencies:
   ```bash
   npm install
   ```

2. **Run Local Development Server**:
   Start the Next.js development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

3. **Code Quality & Validation**:
   Validate TypeScript compilation, Next.js build-time integrity, and code styles:
   ```bash
   # Type check and build validation
   npm run build

   # Run ESLint validation
   npm run lint
   ```

---

## 🎨 Theme & Layout Customization

- **Global CSS**: Styling tokens, background canvas parameters, and animations are managed in `styles/globals.css`.
- **Tailwind Extensions**: Utility colors, border radius, and fonts are customized in `tailwind.config.js`.
- **Icons**: Lucide React is configured for layout decorations.
