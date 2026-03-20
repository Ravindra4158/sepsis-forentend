import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/common/Button'

export default function Unauthorized() {
  const { roleHome, role } = useAuth()
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🔒</div>
        <h1 style={{ fontSize: 26, marginBottom: 10, color: 'var(--red)' }}>Access Denied</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.7 }}>
          Your role <strong style={{ color: 'var(--text-secondary)' }}>({role})</strong> does not have permission to access this page.
          Please contact your administrator if you believe this is an error.
        </p>
        <Button variant="primary" onClick={() => navigate(roleHome)}>← Go to My Dashboard</Button>
      </div>
    </div>
  )
}
