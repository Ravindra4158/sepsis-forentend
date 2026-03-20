import React from 'react'
import { useNavigate } from 'react-router-dom'
import UserForm from '@/components/forms/UserForm'
import Button   from '@/components/common/Button'
import userService from '@/services/userService'
import { notify } from '@/components/common/NotificationToast'

export default function AddUser() {
  const navigate = useNavigate()
  const [creating, setCreating] = React.useState(false)

  const handleCreate = async (form) => {
    setCreating(true)
    try {
      await userService.create({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        ward: form.ward || null,
        phone: form.phone || null,
      })
      navigate('/users', {
        replace: true,
        state: {
          refreshAt: Date.now(),
          flashSuccess: `${form.name} created successfully`,
        },
      })
    } catch (err) {
      notify.error(err.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="anim-fade" style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/users')}>← Back</Button>
        <div>
          <h1 style={{ fontSize: 22, marginBottom: 2 }}>Add New User</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Create a staff account with role-based access</p>
        </div>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px 32px' }}>
        <UserForm onSubmit={handleCreate} loading={creating} />
      </div>
    </div>
  )
}
