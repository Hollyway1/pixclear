
import { Link } from 'react-router-dom'
import {
  Check,
  Sparkles,
  Zap,
  Crown,
  Building2,
  ArrowRight,
  LockKeyhole,
  MoveUpRight,
} from 'lucide-react'

const plans = [
  {
    name: 'Free',
    icon: Sparkles,
    description: 'A simple way to get started with Pixclear.',
    price: '$0',
    period: '/ forever',
    button: 'Get Started Free',
    featured: false,
    available: true,
    features: [
      'Basic background removal',
      'Standard image downloads',
      'Access to essential tools',
      'Personal image projects',
    ],
  },
  {
    name: 'Starter',
    icon: Zap,
    description: 'For individuals who work with images regularly.',
    price: 'Coming soon',
    period: '',
    button: 'Coming Soon',
    featured: false,
    available: false,
    features: [
      'Expanded image-processing allowance',
      'More download flexibility',
      'Access to additional tools',
      'Suitable for regular projects',
    ],
  },
  {
    name: 'Pro',
    icon: Crown,
    description: 'For creators who want more from their workflow.',
    price: 'Coming soon',
    period: '',
    button: 'Coming Soon',
    featured: true,
    available: false,
    features: [
      'Higher image-processing allowance',
      'Professional image workflow',
      'Access to advanced tools',
      'More creative flexibility',
    ],
  },
  {
    name: 'Business',
    icon: Building2,
    description: 'For businesses with larger image-processing needs.',
    price: 'Custom',
    period: '',
    button: 'Coming Soon',
    featured: false,
    available: false,
    features: [
      'Business-focused usage options',
      'Scalable image-processing needs',
      'Business workflow options',
      'Custom plan discussions',
    ],
  },
]

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="relative isolate overflow-hidden bg-[#F5F2FA] px-5 py-24 sm:py-32"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-40 top-10 -z-10 h-[500px] w-[500px] rounded-full bg-violet-200/40 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-52 -left-32 -z-10 h-[450px] w-[450px] rounded-full bg-purple-200/40 blur-[100px]" />

      <div className="pointer-events-none absolute right-[-8%] top-[25%] -z-10 h-72 w-[55%] rotate-[-18deg] rounded-[100px] border border-violet-200/60" />

      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 shadow-sm">
            <Sparkles size={14} className="text-violet-600" />
            <span className="text-[10px] font-extrabold tracking-[0.18em] text-violet-700">
              SIMPLE. FLEXIBLE. POWERFUL.
            </span>
          </div>

          <h2 className="text-4xl font-black leading-[1.08] tracking-[-0.055em] text-[#171326] sm:text-5xl lg:text-6xl">
            More creativity.
            <br />
            <span className="text-violet-600">Less limitation.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
            Whether you're exploring or building professionally, there's a
            Pixclear plan designed to move your creativity forward.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => {
            const Icon = plan.icon

            return (
              <article
                key={plan.name}
                className={`group relative flex flex-col overflow-hidden rounded-[28px] border p-7 transition-all duration-500 hover:-translate-y-2 ${
                  plan.featured
                    ? 'border-[#39206B] bg-[#21123D] text-white shadow-2xl shadow-violet-950/25 xl:scale-[1.035] xl:z-10'
                    : 'border-white bg-white text-[#171326] shadow-lg shadow-violet-950/[0.04] hover:border-violet-200 hover:shadow-xl hover:shadow-violet-950/[0.09]'
                }`}
              >
                {/* Pro card decoration */}
                {plan.featured && (
                  <>
                    <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border border-violet-400/20" />
                    <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full bg-violet-500/20 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-purple-600/20 blur-3xl" />
                  </>
                )}

                {/* Plan header */}
                <div className="relative flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      plan.featured
                        ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25'
                        : 'bg-violet-50 text-violet-600'
                    }`}
                  >
                    <Icon size={22} strokeWidth={1.8} />
                  </div>

                  {plan.featured ? (
                    <span className="rounded-full border border-violet-300/30 bg-violet-400/15 px-3 py-1.5 text-[9px] font-extrabold tracking-[0.15em] text-violet-200">
                      MOST ADVANCED
                    </span>
                  ) : !plan.available ? (
                    <span className="rounded-full bg-gray-100 px-3 py-1.5 text-[9px] font-bold tracking-wider text-gray-400">
                      COMING SOON
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[9px] font-bold tracking-wider text-emerald-600">
                      AVAILABLE
                    </span>
                  )}
                </div>

                {/* Plan information */}
                <div className="relative mt-8">
                  <h3
                    className={`text-2xl font-extrabold tracking-tight ${
                      plan.featured ? 'text-white' : 'text-[#171326]'
                    }`}
                  >
                    {plan.name}
                  </h3>

                  <p
                    className={`mt-3 min-h-[48px] text-sm leading-6 ${
                      plan.featured ? 'text-violet-200/70' : 'text-gray-500'
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="relative mt-8 flex min-h-[58px] flex-col justify-center">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span
                      className={`font-black tracking-tight ${
                        plan.price === 'Coming soon'
                          ? 'text-xl'
                          : 'text-3xl'
                      } ${
                        plan.featured
                          ? 'text-violet-300'
                          : 'text-[#171326]'
                      }`}
                    >
                      {plan.price}
                    </span>

                    {plan.period && (
                      <span
                        className={`text-xs ${
                          plan.featured ? 'text-violet-200/60' : 'text-gray-400'
                        }`}
                      >
                        {plan.period}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action */}
                {plan.available ? (
                  <Link
                    to="/signup"
                    className="group/button relative mt-6 flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-violet-700 hover:shadow-xl"
                  >
                    {plan.button}
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover/button:translate-x-1"
                    />
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className={`mt-6 flex cursor-not-allowed items-center justify-center gap-2 rounded-xl px-4 py-4 text-sm font-bold ${
                      plan.featured
                        ? 'border border-violet-400/20 bg-violet-500/15 text-violet-200'
                        : 'border border-gray-200 bg-gray-50 text-gray-400'
                    }`}
                  >
                    <LockKeyhole size={14} />
                    {plan.button}
                  </button>
                )}

                {/* Divider */}
                <div
                  className={`my-7 h-px ${
                    plan.featured ? 'bg-white/10' : 'bg-gray-100'
                  }`}
                />

                <p
                  className={`relative mb-5 text-[10px] font-extrabold uppercase tracking-[0.16em] ${
                    plan.featured ? 'text-violet-300' : 'text-gray-400'
                  }`}
                >
                  What's included
                </p>

                {/* Features */}
                <ul className="relative flex-1 space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className={`flex items-start gap-3 text-sm leading-6 ${
                        plan.featured ? 'text-violet-100/80' : 'text-gray-600'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          plan.featured
                            ? 'bg-violet-400/20 text-violet-200'
                            : 'bg-violet-50 text-violet-600'
                        }`}
                      >
                        <Check size={12} strokeWidth={3} />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.featured && (
                  <div className="relative mt-8 flex items-center gap-2 text-xs font-semibold text-violet-300">
                    Built for bigger creative ambitions
                    <MoveUpRight size={14} />
                  </div>
                )}
              </article>
            )
          })}
        </div>

        {/* Bottom note */}
        <div className="mx-auto mt-14 flex max-w-2xl flex-col items-center gap-3 text-center">
          <div className="h-1 w-12 rounded-full bg-violet-500" />
          <p className="text-xs leading-6 text-gray-500">
            Paid plan prices, usage limits and final feature availability will
            be announced before launch.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Pricing
