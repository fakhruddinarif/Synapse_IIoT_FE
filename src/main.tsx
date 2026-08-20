<<<<<<< HEAD
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
// i18n harus diinisialisasi sebelum komponen mana pun memanggil `useTranslation`,
// dan store bahasa membacanya saat modulnya dievaluasi — jadi impor ini harus
// tetap berada di atas, sebelum apa pun yang menyentuh store.
import './i18n'
import './index.css'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
=======
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import { App } from "./App";
import { AppProvider } from "./providers/AppProvider";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
);
>>>>>>> 4a3a241fcce39718238fd40dff5c5c492dfb3ba5
