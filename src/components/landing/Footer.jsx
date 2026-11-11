
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowUpRight,
  Sparkles,
  Heart,
  ArrowRight,
  MoveUp,
} from 'lucide-react'

const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/#features' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/#pricing' },
]

const product = [
  { label: 'Background Remover', href: '/#features' },
  { label: 'Image Processing', href: '/#how-it-works' },
  { label: 'Pricing Plans', href: '/#pricing' },
]

const account = [
  { label: 'Log In', href: '/login' },
  { label: 'Create Account', href: '/signup' },
]

const FooterLinks = ({ title, links }) => (
  <div>
    <h3 className="mb-6 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-300">
      {title}
    </h3>

    <ul className="space-y-4">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            to={link.href}
            className="group inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors duration-200 hover:text-white"
          >
            {link.label}
            <ArrowUpRight
              size={13}
              className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
            />
          </Link>
        </li>
      ))}
    </ul>
  </div>
)

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const location = useLocation()
  const navigate = useNavigate()

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleSectionNavigation = (event, href) => {
    if (!href.startsWith('/#')) return

    event.preventDefault()

    const sectionId = href.split('#')[1]

    if (location.pathname !== '/') {
      navigate('/')

      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 150)
    } else {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })

      window.history.replaceState(null, '', href)
    }
  }

  return (
    <footer className="relative overflow-hidden bg-[#10091F] px-5 pt-20 sm:pt-24">

      {/* Background details */}
      <div className="pointer-events-none absolute -right-32 -top-48 h-[450px] w-[450px] rounded-full bg-violet-700/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-48 -left-32 h-[400px] w-[400px] rounded-full bg-purple-700/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl">

        {/* Brand and links */}
        <div className="grid gap-14 border-b border-white/10 pb-16 sm:grid-cols-2 lg:grid-cols-5 lg:gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              onClick={scrollToTop}
              className="inline-flex items-center gap-3 text-3xl font-black tracking-[-0.07em] text-white"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-lg shadow-violet-600/25">
                <Sparkles size={22} />
              </span>
              pixclear<span className="text-violet-400">.</span>
            </Link>

            <p className="mt-7 max-w-sm text-sm leading-7 text-gray-400">
              Making image background removal simple. Create clean,
              professional images and bring your creative ideas to life
              with Pixclear.
            </p>

            <Link
              to="/signup"
              className="group mt-8 inline-flex items-center gap-3 rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-900/30 transition-all duration-300 hover:-translate-y-1 hover:bg-violet-500"
            >
              Start creating
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <p className="mt-5 text-[11px] font-medium tracking-wide text-gray-600">
              YOUR IMAGES. YOUR CREATIVITY. YOUR CANVAS.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <FooterLinks
              title="Explore"
              links={navigation.map((link) => ({
                ...link,
                onClick: handleSectionNavigation,
              }))}
            />
          </div>

          <div>
            <FooterLinks
              title="Product"
              links={product.map((link) => ({
                ...link,
                onClick: handleSectionNavigation,
              }))}
            />
          </div>

          <div>
            <FooterLinks title="Your Account" links={account} />
          </div>
        </div>

        {/* Bottom footer */}
        <div className="flex flex-col items-center justify-between gap-5 py-8 sm:flex-row">

          <p className="text-xs text-gray-500">
            © {currentYear} Pixclear. All rights reserved.
          </p>

          <p className="flex items-center gap-1.5 text-xs text-gray-500">
            Crafted with
            <Heart
              size={13}
              className="fill-violet-500 text-violet-500"
            />
            for creators.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-gray-400 transition-all duration-300 hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white"
          >
            Back to top
            <MoveUp
              size={14}
              className="transition-transform duration-300 group-hover:-translate-y-1"
            />
          </button>
        </div>

      </div>

      {/* Bottom brand accent */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-violet-700 via-fuchsia-500 to-violet-400" />
    </footer>
  )
}

export default Footer
