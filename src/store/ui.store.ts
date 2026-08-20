import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UiState {
  /** Sidebar desktop diciutkan ke rail ikon. Dipersist per operator. */
  sidebarCollapsed: boolean
  toggleSidebarCollapsed: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      toggleSidebarCollapsed: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
    }),
    { name: 'synapse-ui' },
  ),
)
