
import { useAuth } from '../../context/AuthContext'
import {
  UserRound,
  Mail,
  ShieldCheck,
  LockKeyhole,
  CircleCheck,
  Info,
} from 'lucide-react'

import DashboardLayout from '../../layouts/DashboardLayout'
import DashboardHeader from '../../components/dashboard/DashboardHeader'

const Settings = () => {
  const { user } = useAuth()

  const fullName = user?.fullName || 'User'
  const email = user?.email || 'Email unavailable'

  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

  return (
    <DashboardLayout>
      {({ onMenuClick }) => (
        <div className="min-h-screen bg-[#FAF9FC]">
          <DashboardHeader onMenuClick={onMenuClick} />

          <main className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

            {/* Heading */}
            <div className="mb-9">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#8060D8]">
                <LockKeyhole size={16} />
                <span>Account preferences</span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-[#201A2C] sm:text-3xl">
                Settings
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#898294]">
                View your account information and learn how your Pixclear
                account is protected.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-7 xl:grid-cols-[1.5fr_1fr]">

              {/* Account information */}
              <section className="space-y-6">

                <div className="overflow-hidden rounded-2xl border border-[#EEE9F4] bg-white shadow-sm">
                  <div className="border-b border-[#F0EDF3] px-6 py-5">
                    <h2 className="text-base font-bold text-[#292233]">
                      Personal Information
                    </h2>

                    <p className="mt-1 text-sm text-[#968EA0]">
                      Your registered account details.
                    </p>
                  </div>

                  <div className="p-6">

                    {/* Profile identity */}
                    <div className="mb-7 flex items-center gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#9B7AE9] to-[#6746BD] text-xl font-bold text-white shadow-lg shadow-[#8060D8]/20">
                        {initials || 'U'}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-bold text-[#292233]">
                          {fullName}
                        </h3>

                        <p className="mt-1 text-sm text-[#968EA0]">
                          Pixclear Account
                        </p>
                      </div>
                    </div>

                    <div className="space-y-5">

                      {/* Full name */}
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#968EA0]">
                          Full Name
                        </label>

                        <div className="flex items-center gap-3 rounded-xl border border-[#EEE9F4] bg-[#FCFBFD] px-4 py-4">
                          <UserRound size={18} className="shrink-0 text-[#8060D8]" />

                          <span className="min-w-0 flex-1 break-words text-sm font-medium text-[#393143]">
                            {fullName}
                          </span>
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#968EA0]">
                          Email Address
                        </label>

                        <div className="flex items-center gap-3 rounded-xl border border-[#EEE9F4] bg-[#FCFBFD] px-4 py-4">
                          <Mail size={18} className="shrink-0 text-[#8060D8]" />

                          <span className="min-w-0 flex-1 break-all text-sm font-medium text-[#393143]">
                            {email}
                          </span>
                        </div>
                      </div>

                    </div>

                    <div className="mt-6 flex items-start gap-3 rounded-xl bg-[#F6F2FF] p-4">
                      <Info size={18} className="mt-0.5 shrink-0 text-[#8060D8]" />

                      <p className="text-xs leading-6 text-[#71658A]">
                        Your account information is currently read-only.
                        Profile editing will be available when account
                        update functionality is added.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account security */}
                <div className="rounded-2xl border border-[#EEE9F4] bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF7F0] text-[#239B62]">
                      <ShieldCheck size={22} />
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-[#292233]">
                        Account Security
                      </h2>

                      <p className="mt-1 text-xs text-[#968EA0]">
                        Your account authentication
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 rounded-xl border border-[#EEE9F4] p-4">
                    <div className="flex items-center gap-3">
                      <LockKeyhole size={19} className="text-[#8060D8]" />

                      <div>
                        <p className="text-sm font-semibold text-[#393143]">
                          Secure session
                        </p>

                        <p className="mt-1 text-xs text-[#968EA0]">
                          Authentication managed by Pixclear
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#239B62]">
                      <CircleCheck size={16} />
                      Active
                    </div>
                  </div>

                  <p className="mt-4 text-xs leading-6 text-[#968EA0]">
                    Pixclear uses secure authentication cookies to maintain
                    your signed-in session. Always log out when using a
                    shared device.
                  </p>
                </div>
              </section>

              {/* Side information */}
              <aside className="space-y-6">

                <div className="rounded-2xl border border-[#EEE9F4] bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0EBFF] text-[#8060D8]">
                    <ShieldCheck size={23} />
                  </div>

                  <h2 className="text-base font-bold text-[#292233]">
                    Your Privacy Matters
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#968EA0]">
                    Your account information is retrieved from your
                    authenticated session. Your password is not displayed
                    or exposed on this page.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#EEE9F4] bg-white p-6 shadow-sm">
                  <h2 className="text-base font-bold text-[#292233]">
                    Account Features
                  </h2>

                  <div className="mt-5 space-y-4">
                    {[
                      'Personal account dashboard',
                      'Saved image projects',
                      'Background removal history',
                      'Secure account authentication',
                    ].map((feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-3"
                      >
                        <CircleCheck
                          size={17}
                          className="mt-0.5 shrink-0 text-[#32A36E]"
                        />

                        <p className="text-sm text-[#625A6E]">
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E8DFFC] bg-[#F5F1FF] p-6">
                  <h2 className="text-sm font-bold text-[#6044A8]">
                    Need assistance?
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#82729F]">
                    If you have questions about your account or Pixclear,
                    visit the Help & Support section.
                  </p>

                  <a
                    href="/dashboard/support"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#8060D8] transition hover:text-[#5F40B8]"
                  >
                    Get Help
                    <span aria-hidden="true">→</span>
                  </a>
                </div>

              </aside>
            </div>

            <footer className="mt-12 border-t border-[#EDE9F2] py-6 text-center">
              <p className="text-xs font-medium text-[#A09AAA]">
                © {new Date().getFullYear()} Pixclear. All rights reserved.
              </p>
            </footer>

          </main>
        </div>
      )}
    </DashboardLayout>
  )
}

export default Settings
