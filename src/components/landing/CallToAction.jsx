
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  WandSparkles,
  Image as ImageIcon,
  Scan,
} from 'lucide-react'

const benefits = [
  'Simple to use',
  'Fast AI processing',
  'Free to get started',
]

const CallToAction = () => {
  return (
    <section className="relative isolate overflow-hidden bg-white px-5 py-20 sm:py-28">
      {/* Main CTA canvas */}
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#160B2D] shadow-2xl shadow-violet-950/20 sm:rounded-[2.5rem]">

        {/* Background artwork */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-40 h-[500px] w-[500px] rounded-full bg-violet-600/30 blur-[110px]" />
          <div className="absolute -bottom-48 -left-32 h-[450px] w-[450px] rounded-full bg-fuchsia-700/20 blur-[100px]" />

          <div className="absolute -right-32 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rotate-[-25deg] rounded-[120px] border border-violet-300/10" />
          <div className="absolute -right-20 top-1/2 h-[480px] w-[480px] -translate-y-1/2 rotate-[-25deg] rounded-[100px] border border-violet-300/[0.08]" />

          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '26px 26px',
            }}
          />
        </div>

        {/* Decorative image composition */}
        <div className="pointer-events-none absolute -right-10 top-10 hidden h-[420px] w-[420px] lg:block">
          <div className="absolute right-10 top-10 h-72 w-72 rotate-12 rounded-[3rem] border border-violet-300/20 bg-violet-400/[0.06] backdrop-blur-sm" />

          <div className="absolute right-24 top-20 flex h-64 w-64 -rotate-6 items-center justify-center rounded-[2.5rem] border border-white/15 bg-gradient-to-br from-violet-500/30 to-fuchsia-500/10 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex h-40 w-40 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10">
              <ImageIcon size={76} strokeWidth={0.9} className="text-white/90" />
            </div>
          </div>

          <div className="absolute right-5 top-64 flex rotate-6 items-center gap-3 rounded-2xl border border-white/15 bg-[#241342]/90 px-5 py-4 shadow-2xl backdrop-blur-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500">
              <Scan size={20} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">AI Powered</p>
              <p className="mt-1 text-[10px] text-violet-200/70">
                Clean results, faster
              </p>
            </div>
          </div>

          <div className="absolute right-64 top-12 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-violet-200">
            <Sparkles size={23} />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl px-7 py-16 sm:px-12 sm:py-20 lg:px-20 lg:py-24">

          <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-4 py-2 text-[10px] font-extrabold tracking-[0.17em] text-violet-200">
            <Sparkles size={14} />
            YOUR NEXT CREATIVE STEP STARTS HERE
          </div>

          <h2 className="mt-8 max-w-3xl text-4xl font-black leading-[1.08] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
            Great images.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-purple-200">
              No background
              <br className="hidden sm:block" /> distractions.
            </span>
          </h2>

          <p className="mt-7 max-w-xl text-sm leading-7 text-violet-100/75 sm:text-base">
            Your ideas deserve to stand out. Remove unwanted backgrounds,
            create cleaner visuals and move from inspiration to finished
            images with Pixclear.
          </p>

          {/* Benefits */}
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-4">
            {benefits.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-xs font-medium text-violet-100/90 sm:text-sm"
              >
                <CheckCircle2 size={16} className="shrink-0 text-violet-300" />
                {item}
              </div>
            ))}
          </div>

          {/* Action */}
          <div className="mt-11 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <Link
              to="/signup"
              className="group inline-flex items-center gap-3 rounded-xl bg-white px-7 py-4 text-sm font-extrabold text-violet-800 shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:bg-violet-50 hover:shadow-2xl"
            >
              <WandSparkles size={18} />
              Start Creating for Free
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <span className="text-xs text-violet-200/60">
              No complicated editing. Just results.
            </span>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-violet-300" />
      </div>
    </section>
  )
}

export default CallToAction
