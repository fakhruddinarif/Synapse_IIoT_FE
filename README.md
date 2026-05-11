# Synapse IIoT Frontend Boilerplate

Industrial IoT Gateway & Mini-SCADA frontend built with React 18, TypeScript, Tailwind CSS v4, and React Router v7.

## Quick start

```bash
npm install
npm run dev
```

The app expects the backend running at `http://localhost:5009` by default. Update `.env.development` if needed.

## Environment

Copy `.env.example` into `.env.development` or `.env.local` for overrides. Defaults include:

- REST API: `VITE_API_BASE_URL=http://localhost:5009/api`
- SignalR hub: `VITE_SIGNALR_HUB_URL=http://localhost:5009/signalr/device-hub`
- File base URL: `VITE_FILE_BASE_URL=http://localhost:5009`

## Theme system

- Modes: `dark`, `light`, `system`
- Stored key: `synapse-theme` in localStorage
- Theme applied by adding `.dark` or `.light` class on `<html>`
- Theme toggle components live in `src/presentation/design-system/components/ThemeToggle`

## Project structure

The repo follows Clean Architecture:

- `src/core` — Domain entities, enums, and use cases
- `src/infrastructure` — API clients, SignalR, services
- `src/application` — Stores, hooks, providers
- `src/presentation` — Design system, layouts, pages
- `src/shared` — Utilities, constants, types, validators

## Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — typecheck and build
- `npm run lint` — lint all files

## Notes

- Cookie-based auth: JWT in `JWT-TOKEN` cookie; no token storage in frontend.
- SignalR is the single realtime channel; MQTT/OPC-UA handled by backend.
