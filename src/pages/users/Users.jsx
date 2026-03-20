import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import userService  from '@/services/userService'
import UserForm     from '@/components/forms/UserForm'
import StatusBadge  from '@/components/common/StatusBadge'
import Button       from '@/components/common/Button'
import Modal        from '@/components/common/Modal'
import Loader, { SkeletonRow } from '@/components/common/Loader'
import { ROLE_META } from '@/utils/rbac'
import { notify }   from '@/components/common/NotificationToast'
import { formatDateTime } from '@/utils/formatDate'

export default function Users() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [editUser,setEditUser]= useState(null)
  const [delUser, setDelUser] = useState(null)
  const [delLoading, setDelLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [hoveredId, setHoveredId]   = useState(null)

  const load = () => {
    setLoading(true)
    userService.getAll()
      .then(d => setUsers(d.items || d))
      .catch(err => notify.error(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    if (!location.state?.refreshAt && !location.state?.flashSuccess) return
    load()
    if (location.state?.flashSuccess) notify.success(location.state.flashSuccess)
    navigate(location.pathname, { replace: true, state: null })
  }, [location.state, location.pathname, navigate])

  const handleDelete = async () => {
    if (!delUser) return
    setDelLoading(true)
    try {
      await userService.delete(delUser.id)
      notify.success(`${delUser.name} deleted successfully`)
      setDelUser(null)
      load()
    } catch (err) {
      notify.error(err.message)
    } finally {
      setDelLoading(false)
    }
  }

  const handleUpdate = async (form) => {
    if (!editUser) return
    setEditLoading(true)
    try {
      await userService.update(editUser.id, {
        name: form.name,
        ward: form.ward || null,
        phone: form.phone || null,
      })
      notify.success(`${form.name} updated successfully`)
      setEditUser(null)
      load()
    } catch (err) {
      notify.error(err.message)
    } finally {
      setEditLoading(false)
    }
  }

  return (
    <div className="anim-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>User Management</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{users.length} staff accounts</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => navigate('/users/add')}>+ Add User</Button>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.025)', borderBottom: '1px solid var(--border)' }}>
              {['Name','Email','Role','Ward','Status','Last Login','Actions'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, letterSpacing: '0.09em', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {h.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <SkeletonRow cols={7} rows={5} />}
            {!loading && users.map((u, i) => {
              const meta = ROLE_META[u.role] || {}
              return (
                <tr key={u.id}
                  onMouseEnter={() => setHoveredId(u.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    borderBottom: i < users.length-1 ? '1px solid var(--border)' : 'none',
                    background: hoveredId === u.id ? 'var(--bg-card-hover)' : 'transparent',
                    transition: 'background 0.1s',
                  }}
                >
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                        background: `${meta.color}18`, border: `1.5px solid ${meta.color}50`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, color: meta.color,
                      }}>
                        {u.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px', color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: meta.color }}>
                      {meta.icon} {meta.label}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px', color: 'var(--text-secondary)' }}>{u.ward || '—'}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <StatusBadge status={u.is_active ? 'online' : 'offline'} label={u.is_active ? 'Active' : 'Inactive'} dot size="xs" />
                  </td>
                  <td style={{ padding: '13px 16px', color: 'var(--text-muted)', fontSize: 11 }}>
                    {formatDateTime(u.last_login)}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Button variant="secondary" size="xs" onClick={() => setEditUser(u)}>Edit</Button>
                      <Button variant="danger"    size="xs" onClick={() => setDelUser(u)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {!loading && users.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No users found</div>
        )}
      </div>

      {/* Edit modal */}
      <Modal open={!!editUser} onClose={() => setEditUser(null)} title="Edit User" size="md"
        footer={<Button variant="ghost" onClick={() => setEditUser(null)}>Cancel</Button>}>
        {editUser && (
          <UserForm
            initialData={{
              name: editUser.name || '',
              email: editUser.email || '',
              role: editUser.role || '',
              ward: editUser.ward || '',
              phone: editUser.phone || '',
            }}
            isEdit
            onSubmit={handleUpdate}
            loading={editLoading}
          />
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!delUser} onClose={() => setDelUser(null)} title="Delete User" size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDelUser(null)}>Cancel</Button>
            <Button variant="danger" loading={delLoading} onClick={handleDelete}>Delete</Button>
          </>
        }>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{delUser?.name}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
