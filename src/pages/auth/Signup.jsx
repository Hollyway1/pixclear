
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'

import AuthBrandPanel from '../../components/auth/AuthBrandPanel'
import { useAuth } from '../../context/AuthContext'

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)

  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loading) return

    setNotice('')

    const formData = new FormData(e.currentTarget)

    const fullName = String(formData.get('fullName') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const password = String(formData.get('password') || '')
    const confirmPassword = String(formData.get('confirmPassword') || '')

    if (password.length < 8) {
      setNotice('Password must contain at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setNotice('Your passwords do not match. Please try again.')
      return
    }

    setLoading(true)

    try {
      await signup({
        fullName,
        email,
        password,
        confirmPassword,
      })

      navigate('/dashboard', { replace: true })
    } catch (error) {
      setNotice(error.message || 'Account creation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-[#EAE5F1] bg-[#FBFAFD] px-4 py-4 text-sm text-gray-800 outline-none transition duration-300 placeholder:text-gray-400 hover:border-violet-200 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 disabled:opacity-60'

  const labelClass =
    'mb-2.5 block text-[13px] font-bold text-[#332644]'

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F5FC] p-3 sm:p-5 lg:p-8">

      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-300/20 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[500px] w-[500px] rounded-full bg-fuchsia-300/20 blur-[120px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1400px] overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_25px_100px_rgba(48,24,89,0.10)] sm:min-h-[calc(100vh-2.5rem)] lg:min-h-[calc(100vh-4rem)]">

        {/* Promotional panel */}
        <AuthBrandPanel variant="signup" />

        {/* Signup section */}
        <section className="relative flex w-full flex-col justify-center px-6 py-20 sm:px-12 lg:w-1/2 lg:px-16 xl:px-20">

          {/* Back to home */}
          <Link
            to="/"
            className="absolute left-6 top-7 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-gray-500 transition duration-200 hover:bg-violet-50 hover:text-violet-700 sm:left-12 lg:left-16"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <div className="mx-auto w-full max-w-[420px]">

            {/* Mobile branding */}
            <Link
              to="/"
              className="mb-9 inline-flex items-center gap-2 text-2xl font-black tracking-[-0.07em] text-[#24133D] lg:hidden"
            >
              pixclear
              <span className="text-violet-600">.</span>
              <Sparkles size={17} className="text-violet-500" />
            </Link>

            {/* Heading */}
            <div className="mb-7">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5">
                <Sparkles size={13} className="text-violet-600" />
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-violet-700">
                  Start creating with Pixclear
                </span>
              </div>

              <h1 className="text-[34px] font-extrabold tracking-[-0.055em] text-[#211333] sm:text-[40px]">
                Create your account<span className="text-violet-600">.</span>
              </h1>

              <p className="mt-3 text-sm leading-7 text-gray-500 sm:text-[15px]">
                A better way to transform your images starts here.
                Join Pixclear today.
              </p>
            </div>

            {/* Signup form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              aria-busy={loading}
            >

              {/* Full name */}
              <div>
                <label htmlFor="signup-name" className={labelClass}>
                  Full Name
                </label>

                <input
                  id="signup-name"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  maxLength={100}
                  required
                  disabled={loading}
                  className={inputClass}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="signup-email" className={labelClass}>
                  Email Address
                </label>

                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                  className={inputClass}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="signup-password" className={labelClass}>
                  Password
                </label>

                <div className="relative">
                  <input
                    id="signup-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    minLength={8}
                    required
                    disabled={loading}
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-violet-600 disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>

                <p className="mt-2 text-[11px] text-gray-400">
                  Your password must contain at least 8 characters.
                </p>
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="signup-confirm-password"
                  className={labelClass}
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    id="signup-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Enter your password again"
                    minLength={8}
                    required
                    disabled={loading}
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    aria-label={
                      showConfirmPassword ? 'Hide password' : 'Show password'
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-violet-600 disabled:opacity-50"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {notice && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs leading-5 text-red-600"
                >
                  {notice}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#6428D9] py-[17px] text-sm font-bold text-white shadow-[0_10px_25px_rgba(100,40,217,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#5320BC] hover:shadow-[0_14px_30px_rgba(100,40,217,0.30)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? 'Creating your account...' : 'Create My Account'}

                {!loading && (
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            {/* Login link */}
            <p className="mt-7 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-extrabold text-violet-600 transition hover:text-violet-800"
              >
                Sign in
              </Link>
            </p>

            {/* Security note */}
            <div className="mt-8 flex items-center justify-center gap-2 border-t border-[#F0ECF5] pt-6">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span className="text-[11px] font-medium text-gray-400">
                Your account and images are protected.
              </span>
            </div>

          </div>
        </section>
      </div>
    </main>
  )
}

export default Signup
