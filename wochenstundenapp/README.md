# Wochenstunden-App

## Start (lokal)
1. Node.js (LTS) installieren
2. Im Projektordner:
```bash
npm install
npm run dev
```

## GitHub Pages (optional)
In `vite.config.ts` `base: "/REPO_NAME/"` setzen, dann:
```bash
npm run build
```
Danach GitHub Pages auf `main` / `dist` veröffentlichen (oder per Action).
