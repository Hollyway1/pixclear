
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Authentication
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Public pages
import Home from './pages/landing/Home'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'

// Dashboard pages
import Dashboard from './pages/dashboard/Dashboard'
import Projects from './pages/dashboard/Projects'
import Settings from './pages/dashboard/Settings'
import Support from './pages/dashboard/Support'

// Workspace
import Workspace from './pages/workspace/Workspace'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/projects" element={<Projects />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/dashboard/support" element={<Support />} />

            <Route path="/workspace" element={<Workspace />} />
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
