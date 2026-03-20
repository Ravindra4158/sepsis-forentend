import React, { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import { ROLES, PERMISSIONS } from '@/utils/rbac'
import { useAuth } from '@/hooks/useAuth'
import Loader from '@/components/common/Loader'
import PageContainer from '@/components/layout/PageContainer'

// Auth pages (eager)
import Login          from '@/pages/auth/Login'
import ForgotPassword from '@/pages/auth/ForgotPassword'

// Lazy-loaded pages
const DoctorDashboard  = lazy(() => import('@/pages/dashboard/DoctorDashboard'))
const NurseDashboard   = lazy(() => import('@/pages/dashboard/NurseDashboard'))
const AdminPanel       = lazy(() => import('@/pages/dashboard/AdminPanel'))
const AuditLog         = lazy(() => import('@/pages/admin/AuditLog'))
const Patients         = lazy(() => import('@/pages/patients/Patients'))
const PatientDetails   = lazy(() => import('@/pages/patients/PatientDetails'))
const AddPatient       = lazy(() => import('@/pages/patients/AddPatient'))
const AddVitals        = lazy(() => import('@/pages/vitals/AddVitals'))
const Alerts           = lazy(() => import('@/pages/alerts/Alerts'))
const Users            = lazy(() => import('@/pages/users/Users'))
const AddUser          = lazy(() => import('@/pages/users/AddUser'))
const Settings         = lazy(() => import('@/pages/settings/Settings'))

const Fallback = () => <Loader fullscreen />

function RoleRedirect() {
  const { homeRoute } = useAuth()
  return <Navigate to={homeRoute} replace />
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        {/* Public */}
        <Route path="/login"           element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Root redirect */}
        <Route path="/" element={<RoleRedirect />} />

        {/* ── Doctor routes ─────────────────────────── */}
        <Route path="/dashboard/doctor" element={
          <ProtectedRoute roles={[ROLES.DOCTOR]}>
            <PageContainer><DoctorDashboard /></PageContainer>
          </ProtectedRoute>
        } />

        {/* ── Nurse routes ──────────────────────────── */}
        <Route path="/dashboard/nurse" element={
          <ProtectedRoute roles={[ROLES.NURSE]}>
            <PageContainer><NurseDashboard /></PageContainer>
          </ProtectedRoute>
        } />

        {/* ── Admin routes ──────────────────────────── */}
        <Route path="/admin" element={
          <ProtectedRoute roles={[ROLES.ADMIN]}>
            <PageContainer><AdminPanel /></PageContainer>
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute permission={PERMISSIONS.MANAGE_USERS}>
            <PageContainer><Users /></PageContainer>
          </ProtectedRoute>
        } />
        <Route path="/admin/audit-log" element={
          <ProtectedRoute roles={[ROLES.ADMIN]}>
            <PageContainer><AuditLog /></PageContainer>
          </ProtectedRoute>
        } />
        <Route path="/users/add" element={
          <ProtectedRoute permission={PERMISSIONS.MANAGE_USERS}>
            <PageContainer><AddUser /></PageContainer>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute permission={PERMISSIONS.CONFIGURE_SYSTEM}>
            <PageContainer><Settings /></PageContainer>
          </ProtectedRoute>
        } />

        {/* ── Shared clinical routes (doctor + nurse) ── */}
        <Route path="/patients" element={
          <ProtectedRoute permission={PERMISSIONS.VIEW_PATIENTS}>
            <PageContainer><Patients /></PageContainer>
          </ProtectedRoute>
        } />
        <Route path="/patients/:id" element={
          <ProtectedRoute permission={PERMISSIONS.VIEW_PATIENTS}>
            <PageContainer><PatientDetails /></PageContainer>
          </ProtectedRoute>
        } />
        <Route path="/patients/add" element={
          <ProtectedRoute permission={PERMISSIONS.ADD_PATIENT}>
            <PageContainer><AddPatient /></PageContainer>
          </ProtectedRoute>
        } />
        <Route path="/vitals/add/:patientId" element={
          <ProtectedRoute permission={PERMISSIONS.UPDATE_VITALS}>
            <PageContainer><AddVitals /></PageContainer>
          </ProtectedRoute>
        } />
        <Route path="/alerts" element={
          <ProtectedRoute permission={PERMISSIONS.VIEW_ALERTS}>
            <PageContainer><Alerts /></PageContainer>
          </ProtectedRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<RoleRedirect />} />
      </Routes>
    </Suspense>
  )
}
