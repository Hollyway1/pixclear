
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'

const ForgotPassword = () => {
  const [notice, setNotice] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setNotice('Password recovery interface is ready. Email delivery will be connected during backend integration.')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-violet-50 px-5 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-violet-100 sm:p-10">

        <Link
          to="/"
          className="mb-10 inline-flex items-center gap-2 text-2xl font-extrabold text-violet-700"
        >
          pixclear<span className="text-violet-400">.</span>
          <Sparkles size={19} />
        </Link>

        <Link
          to="/login"
          className="mb-7 flex items-center gap-2 text-sm text-gray-500 hover:text-violet-600"
        >
          <ArrowLeft size={17} />
          Back to Login
        </Link>

        <h1 className="text-3xl font-extrabold text-gray-900">
          Forgot Password?
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          Enter the email address associated with your account.
          We'll use it to help you reset your password.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="recovery-email"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Email Address
            </label>

            <input
              id="recovery-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Enter your email address"
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-violet-600 py-3.5 text-sm font-bold text-white transition hover:bg-violet-700"
          >
            Reset Password
          </button>

          {notice && (
            <p role="status" className="rounded-lg bg-violet-50 p-3 text-xs leading-5 text-violet-700">
              {notice}
            </p>
          )}
        </form>

      </div>
    </main>
  )
}

export default ForgotPassword
