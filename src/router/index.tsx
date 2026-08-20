import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from './guards'

/**
 * Setiap halaman di-`lazy` supaya bundel awal hanya memuat chrome dan halaman
 * yang benar-benar dibuka. Penting untuk gateway yang dilayani dari perangkat di
 * pabrik, bukan dari CDN — bandwidth pertama kali muat adalah bandwidth
 * jaringan lokal, dan halaman berat seperti form storage flow tidak perlu ikut
 * diunduh operator yang hanya melihat dasbor.
 */
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'))
const DevicesPage = lazy(() => import('@/pages/devices/DevicesPage'))
const TagsPage = lazy(() => import('@/pages/tags/TagsPage'))
const DynamicTablesPage = lazy(() => import('@/pages/tables/DynamicTablesPage'))
const StorageFlowsPage = lazy(() => import('@/pages/storage-flows/StorageFlowsPage'))
const LoginPage = lazy(() => import('@/pages/login/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/register/RegisterPage'))
const NotFoundPage = lazy(() => import('@/pages/not-found/NotFoundPage'))

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/',
    // Seluruh aplikasi berada di balik satu ProtectedRoute, bukan satu per
    // rute: tidak ada halaman di gateway ini yang boleh dilihat tanpa sesi, dan
    // membungkusnya di sini berarti tidak ada rute baru yang bisa lupa dijaga.
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },

      // Grup menu, bukan halaman — tautan induknya tetap harus punya tujuan.
      { path: 'connectivity', element: <Navigate to="/connectivity/devices" replace /> },
      { path: 'connectivity/devices', element: <DevicesPage /> },
      { path: 'connectivity/tags', element: <TagsPage /> },

      { path: 'data-engine', element: <Navigate to="/data-engine/tables" replace /> },
      { path: 'data-engine/tables', element: <DynamicTablesPage /> },
      { path: 'data-engine/storage-flows', element: <StorageFlowsPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
