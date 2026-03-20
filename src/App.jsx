import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider }    from '@/context/AuthContext'
import { AlertProvider }   from '@/context/AlertContext'
import { PatientProvider } from '@/context/PatientContext'
import { StoreProvider }   from '@/store/store'
import AppRoutes           from '@/routes/AppRoutes'
import ToastContainer      from '@/components/common/NotificationToast'

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AuthProvider>
          <AlertProvider>
            <PatientProvider>
              <AppRoutes />
              <ToastContainer />
            </PatientProvider>
          </AlertProvider>
        </AuthProvider>
      </StoreProvider>
    </BrowserRouter>
  )
}
