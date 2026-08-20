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
