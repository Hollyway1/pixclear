
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import {
  Home,
  FolderOpen,
  Settings,
  Headset,
  Sparkles,
  LogOut,
  X,
  Crown,
  ChevronRight,
  Zap,
  ShieldCheck,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

const navigation = [
  {
    label: 'Home',
    icon: Home,
    path: '/dashboard',
  },
  {
    label: 'Projects',
    icon: FolderOpen,
    path: '/dashboard/projects',
  },
  {
    label: 'Settings',
    icon: Settings,
    path: '/dashboard/settings',
  },
  {
    label: 'Help & Support',
    icon: Headset,
    path: '/dashboard/support',
  },
]

const DashboardSidebar = ({ open, onClose }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const { logout } = useAuth()

  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState('')

  const handleLogout = async () => {
    if (loggingOut) return

    setLoggingOut(true)
    setLogoutError('')

    try {
      await logout()
      navigate('/login', { replace: true })
    } catch (error) {
      setLogoutError(
        'Could not contact the server. Please check your connection and try again.'
      )
    } finally {
      setLoggingOut(false)
    }
  }

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard'
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    )
  }

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#10091F]/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col overflow-hidden border-r border-white/[0.07] bg-[#160D26] px-5 py-6 text-white shadow-2xl shadow-black/20 transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none ${
          open
            ? 'translate-x-0 pointer-events-auto'
            : '-translate-x-full pointer-events-none lg:pointer-events-auto'
        }`}
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-24 top-20 h-64 w-64 rounded-full bg-violet-600/15 blur-[90px]" />

        <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-fuchsia-600/10 blur-[90px]" />

        {/* Brand */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            to="/"
            onClick={onClose}
            className="group flex items-center gap-2.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-500/15 shadow-lg shadow-violet-950/30 transition duration-300 group-hover:bg-violet-500/25">
              <Sparkles size={20} className="text-violet-300" />
            </div>

            <span className="text-[25px] font-black tracking-[-0.07em] text-white">
              pixclear<span className="text-violet-400">.</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Workspace navigation */}
        <div className="relative z-10 mt-12">
          <div className="mb-4 flex items-center justify-between px-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
              Workspace
            </p>

            <span className="rounded-md border border-white/[0.07] bg-white/[0.04] px-2 py-1 text-[9px] font-semibold text-gray-500">
              MAIN
            </span>
          </div>

          <nav
            aria-label="Dashboard navigation"
            className="space-y-2"
          >
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={onClose}
                  aria-current={active ? 'page' : undefined}
                  className={`group relative flex items-center justify-between rounded-xl px-3.5 py-3.5 text-sm font-semibold transition-all duration-300 ${
                    active
                      ? 'border border-violet-400/20 bg-gradient-to-r from-violet-600/30 to-violet-500/10 text-white shadow-lg shadow-violet-950/20'
                      : 'border border-transparent text-gray-400 hover:border-white/[0.06] hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 ${
                        active
                          ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/30'
                          : 'bg-white/[0.05] text-gray-400 group-hover:bg-violet-500/15 group-hover:text-violet-300'
                      }`}
                    >
                      <Icon size={17} strokeWidth={2} />
                    </span>

                    {item.label}
                  </span>

                  {active ? (
                    <>
                      <span className="absolute -left-5 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-violet-400" />

                      <ChevronRight
                        size={16}
                        className="text-violet-300"
                      />
                    </>
                  ) : (
                    <ChevronRight
                      size={15}
                      className="text-gray-600 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Plan card */}
        <div className="relative z-10 overflow-hidden rounded-2xl border border-violet-400/20 bg-gradient-to-br from-[#352052] via-[#29183E] to-[#21142F] p-4 shadow-xl shadow-black/10">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-400/20 blur-3xl" />

          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-400/10">
                <Crown size={18} className="text-amber-300" />
              </div>

              <span className="rounded-full border border-white/10 bg-white/[0.07] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-violet-200">
                Current plan
              </span>
            </div>

            <h3 className="mt-4 text-sm font-bold text-white">
              Free Plan
            </h3>

            <p className="mt-1 text-[11px] leading-5 text-violet-100/60">
              Explore Pixclear and start transforming your images.
            </p>

            <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3">
              <Zap size={13} className="text-violet-300" />

              <span className="text-[10px] font-medium text-violet-100/70">
                Your creative journey starts here.
              </span>
            </div>
          </div>
        </div>

        {/* Logout error */}
        {logoutError && (
          <p
            role="alert"
            className="relative z-10 mt-3 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-xs leading-5 text-red-300"
          >
            {logoutError}
          </p>
        )}

        {/* Logout */}
        <div className="relative z-10 mt-5 border-t border-white/[0.08] pt-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="group flex w-full items-center justify-between rounded-xl px-3.5 py-3 transition duration-200 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="flex items-center gap-3 text-sm font-semibold text-gray-400 transition group-hover:text-red-300">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05] transition group-hover:bg-red-500/10">
                <LogOut size={17} />
              </span>

              {loggingOut ? 'Logging out...' : 'Log Out'}
            </span>

            {!loggingOut && (
              <ChevronRight
                size={15}
                className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-red-300"
              />
            )}
          </button>

          <div className="mt-4 flex items-center justify-center gap-2">
            <ShieldCheck
              size={12}
              className="text-emerald-400/70"
            />

            <span className="text-[9px] font-medium tracking-wide text-gray-500">
              Secure Pixclear Workspace
            </span>
          </div>
        </div>
      </aside>
    </>
  )
}

export default DashboardSidebar
