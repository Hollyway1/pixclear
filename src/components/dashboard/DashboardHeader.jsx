
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  Menu,
  Bell,
  UserCircle,
  Sparkles,
  ChevronDown,
  Settings,
  FolderOpen,
  LogOut,
  UserRound,
  Check,
  ShieldCheck,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

const DashboardHeader = ({ onMenuClick }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [activeMenu, setActiveMenu] = useState(null)
  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState('')

  const menuRef = useRef(null)

  // Generate user initials.
  const initials = user?.fullName
    ? user.fullName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
    : 'U'

  // Close menus when clicking outside or pressing Escape.
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setActiveMenu(null)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setActiveMenu(null)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('touchstart', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const toggleMenu = (menu) => {
    setActiveMenu((current) =>
      current === menu ? null : menu
    )
    setLogoutError('')
  }

  const closeMenu = () => {
    setActiveMenu(null)
  }

  const handleLogout = async () => {
    if (loggingOut) return

    setLoggingOut(true)
    setLogoutError('')

    try {
      await logout()
      closeMenu()
      navigate('/login', { replace: true })
    } catch (error) {
      setLogoutError(
        'Unable to log out. Please check your connection and try again.'
      )
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[#EEEAF4] bg-white/90 px-5 py-4 backdrop-blur-xl sm:px-8 lg:px-10">

      {/* Left section */}
      <div className="flex min-w-0 items-center gap-3">

        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#EAE5F0] bg-white text-[#514363] transition-all duration-200 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight text-[#211432] sm:text-2xl">
              Welcome back{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}!
            </h1>

            <Sparkles
              size={19}
              className="text-violet-500"
            />
          </div>

          <p className="mt-1 text-xs font-medium text-[#938A9F] sm:text-sm">
            Your creative workspace is ready. Let's make something amazing.
          </p>
        </div>
      </div>

      {/* Right section */}
      <div
        ref={menuRef}
        className="relative flex shrink-0 items-center gap-3"
      >

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleMenu('notifications')}
            aria-label="Notifications"
            aria-expanded={activeMenu === 'notifications'}
            className={`group relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 ${
              activeMenu === 'notifications'
                ? 'border-violet-200 bg-violet-50 text-violet-700'
                : 'border-[#EAE5F0] bg-white text-[#766B83] hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700'
            }`}
          >
            <Bell
              size={19}
              className="transition-transform duration-200 group-hover:rotate-[-10deg]"
            />
          </button>

          {activeMenu === 'notifications' && (
            <div className="absolute right-0 top-14 z-50 w-[300px] overflow-hidden rounded-2xl border border-[#EEEAF4] bg-white shadow-2xl shadow-violet-950/10 sm:w-[340px]">

              <div className="flex items-center justify-between border-b border-[#F0ECF5] px-5 py-4">
                <div>
                  <h3 className="text-sm font-bold text-[#211432]">
                    Notifications
                  </h3>
                  <p className="mt-1 text-[11px] text-gray-400">
                    Your workspace updates
                  </p>
                </div>

                <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-600">
                  0 new
                </span>
              </div>

              <div className="flex flex-col items-center px-6 py-9 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-500">
                  <Check size={25} />
                </div>

                <h4 className="mt-4 text-sm font-bold text-[#211432]">
                  You're all caught up!
                </h4>

                <p className="mt-2 max-w-[220px] text-xs leading-5 text-gray-400">
                  There are no new notifications at the moment. We'll keep you updated here.
                </p>
              </div>

            </div>
          )}
        </div>

        <div className="h-8 w-px bg-[#EEEAF4]" />

        {/* Profile button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleMenu('profile')}
            aria-label="Open user profile"
            aria-expanded={activeMenu === 'profile'}
            aria-haspopup="menu"
            className={`group flex items-center gap-2 rounded-full border p-1 pr-2 transition-all duration-200 ${
              activeMenu === 'profile'
                ? 'border-violet-300 bg-violet-50 shadow-md shadow-violet-100'
                : 'border-violet-200 bg-gradient-to-br from-violet-100 to-fuchsia-100 hover:border-violet-400 hover:shadow-md hover:shadow-violet-100'
            }`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-xs font-extrabold text-white shadow-sm">
              {initials}
            </span>

            <ChevronDown
              size={15}
              className={`text-violet-600 transition-transform duration-200 ${
                activeMenu === 'profile' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Profile dropdown */}
          {activeMenu === 'profile' && (
            <div
              role="menu"
              className="absolute right-0 top-14 z-50 w-[290px] overflow-hidden rounded-2xl border border-[#EEEAF4] bg-white shadow-2xl shadow-violet-950/10 sm:w-[320px]"
            >

              {/* User details */}
              <div className="border-b border-[#F0ECF5] bg-gradient-to-br from-violet-50 to-fuchsia-50/50 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-sm font-extrabold text-white shadow-lg shadow-violet-200">
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-extrabold text-[#211432]">
                      {user?.fullName || 'Pixclear User'}
                    </h3>

                    <p className="mt-1 truncate text-xs text-[#938A9F]">
                      {user?.email || 'No email available'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl border border-violet-100 bg-white/80 px-3 py-2">
                  <ShieldCheck
                    size={14}
                    className="text-emerald-500"
                  />

                  <span className="text-[10px] font-semibold text-[#766B83]">
                    Authenticated Pixclear Account
                  </span>
                </div>
              </div>

              {/* Account navigation */}
              <div className="space-y-1 p-2">

                <Link
                  to="/dashboard/settings"
                  role="menuitem"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#514363] transition hover:bg-violet-50 hover:text-violet-700"
                >
                  <UserRound size={17} />
                  My Account
                </Link>

                <Link
                  to="/dashboard/projects"
                  role="menuitem"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#514363] transition hover:bg-violet-50 hover:text-violet-700"
                >
                  <FolderOpen size={17} />
                  My Projects
                </Link>

                <Link
                  to="/dashboard/settings"
                  role="menuitem"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#514363] transition hover:bg-violet-50 hover:text-violet-700"
                >
                  <Settings size={17} />
                  Settings
                </Link>
              </div>

              {/* Logout */}
              <div className="border-t border-[#F0ECF5] p-2">
                {logoutError && (
                  <p
                    role="alert"
                    className="px-3 py-2 text-xs leading-5 text-red-500"
                  >
                    {logoutError}
                  </p>
                )}

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <LogOut size={17} />

                  {loggingOut ? 'Logging out...' : 'Log Out'}
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
