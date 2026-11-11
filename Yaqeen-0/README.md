# Yaqeen Platform - Production Guidelines 🚀

An immersive, highly scalable Islamic Audio & Quranic exploration web App packaged for Android explicitly using Capacitor ecosystem and written via pure React / Vite.

## 🏗 Storage & Architecture

This repository has recently been **cleaned and restructured** to meet a professional production-ready standard. 

### Mandatory Source Constraints
Only the following specific folders are permitted to exist in the `src/` tree over the future iteration of the codebase to prevent cluttering:
- `/src/components` → Global UI snippets, Layout providers, Navbars, Audio engines.
- `/src/pages` → Major root-level routes orchestrating the components.
- `/src/hooks` → Custom React lifecycle mechanisms.
- `/src/store` → Global Zustand state logic (audio, theme, auth bounds).
- `/src/lib` → Library configurations (e.g. Supabase, Firebase) and **local static data references (`src/lib/data/`)**.
- `/public/assets` → Media or external PWA manifests.

### 🧹 Summary of Phase Excision (Clean-up Log)
- **Deleted Modules**: The unfinished / deprecated "Kids" module mapping (`Kids.jsx`, `KidsStory.jsx`, `AmmBaraka.jsx`, `kidsData.js`) have been entirely severed from the build pipeline.
- **Confinement Rules Applied**: `GlobalLayout.jsx` and `seerahData.js` arrays and comparable logic have been shifted strictly out of loose top-level directories (`/layouts` & `/data`) into strict bounds (`/src/components` & `/src/lib`).
- **Log Sanitation**: Heavy sweep of internal `console.error` and `console.log` instances mapping API failures (e.g., Alafasy audio loading) to prevent memory or trace leakage in the Chromium V8 Engine.

## 💾 Native & Web Orchestration
The app is entirely encapsulated by a `dist` production folder constructed securely by Rollup and bound directly into native environments out-of-the-box.

1. **Test Environment**:
```bash
npm run dev
```
2. **Compile Production (PWA & Client)**:
```bash
npm run build
```
3. **Android Capacitor Layering**:
```bash
npx cap sync android
```
*(Proceed to open `android/` directory using Android Studio for signing and App Bundle creation)*
