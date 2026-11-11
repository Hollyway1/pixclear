
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ArrowUpRight } from 'lucide-react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  const closeMenu = () => setIsMenuOpen(false)

  const handleLogoClick = (event) => {
    closeMenu()

    if (location.pathname === '/' && !location.hash) {
      event.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (location.pathname === '/' && location.hash) {
      event.preventDefault()
      navigate('/')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
  ]

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <nav className="relative mx-auto max-w-7xl rounded-2xl border border-white/70 bg-white/75 px-5 py-3 shadow-lg shadow-violet-950/[0.04] backdrop-blur-2xl backdrop-saturate-150 sm:px-7">

        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            onClick={handleLogoClick}
            className="text-2xl font-extrabold tracking-[-0.06em] text-gray-950"
            aria-label="Pixclear home"
          >
            pixclear<span className="text-violet-600">.</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-9 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[13px] font-medium text-gray-600 transition-colors duration-200 hover:text-violet-600"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-violet-50 hover:text-violet-700"
            >
              Log In
            </Link>

            <Link
              to="/signup"
              className="group inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-violet-600/20 transition duration-300 hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-lg"
            >
              Get Started
              <ArrowUpRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white/70 text-gray-700 transition hover:border-violet-200 hover:text-violet-600 md:hidden"
          >
            {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute left-0 right-0 top-[calc(100%+10px)] rounded-2xl border border-white/80 bg-white/95 p-5 shadow-xl shadow-gray-900/10 backdrop-blur-2xl md:hidden">

            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-violet-50 hover:text-violet-700"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
              <Link
                to="/login"
                onClick={closeMenu}
                className="flex items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Log In
              </Link>

              <Link
                to="/signup"
                onClick={closeMenu}
                className="flex items-center justify-center rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar
