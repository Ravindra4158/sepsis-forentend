import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { useStore } from '@/store/store'
import NotificationToast from '@/components/common/NotificationToast'

export default function PageContainer({ children }) {
  const { sidebarOpen } = useStore()
  return (
    <div style={{ display:'flex', minHeight:'100vh', overflow:'hidden', background:'transparent' }}>
      <Sidebar />
      <div style={{
        flex:1, display:'flex', flexDirection:'column', overflow:'hidden',
        marginLeft: sidebarOpen ? 'var(--sidebar-width)' : 'var(--sidebar-collapsed)',
        transition:'margin-left 0.28s ease',
      }}>
        <Navbar />
        <main style={{
          flex:1, overflowY:'auto',
          background:'transparent',
          padding:'24px 28px 32px',
        }}>
          <div style={{ maxWidth:1400, margin:'0 auto' }}>{children}</div>
        </main>
        <Footer />
      </div>
      <NotificationToast />
    </div>
  )
}
