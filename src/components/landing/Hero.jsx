
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  Image as ImageIcon,
  Sparkles,
  WandSparkles,
  ShieldCheck,
  Zap,
  MoveUpRight,
} from 'lucide-react'

const Hero = () => {
  const navigate = useNavigate()

  return (
    <section className="relative isolate overflow-hidden bg-[#160B2D] px-5 pb-24 pt-20 text-white sm:pt-28 lg:pb-32 lg:pt-32">

      {/* Bold background composition */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">

        {/* Large violet sculptural shape */}
        <div
          className="absolute -right-[30%] -top-[45%] h-[1050px] w-[1050px] rounded-full bg-[#5426A8] opacity-80"
          style={{
            transform: 'rotate(-24deg)',
          }}
        />

        <div
          className="absolute -right-[22%] -top-[35%] h-[900px] w-[900px] rounded-full border-[100px] border-[#7544D4]/30"
        />

        {/* Deep purple curved layer */}
        <div
          className="absolute -bottom-[65%] -left-[15%] h-[950px] w-[120%] rounded-[50%] bg-[#241044]"
          style={{
            transform: 'rotate(-12deg)',
          }}
        />

        {/* Violet light behind preview */}
        <div className="absolute right-[5%] top-[20%] h-[500px] w-[500px] rounded-full bg-violet-500/25 blur-[100px]" />

        {/* Decorative angular image frame */}
        <div className="absolute right-[8%] top-[10%] hidden h-[500px] w-[420px] rotate-12 rounded-[3rem] border border-white/10 lg:block" />

        <div className="absolute left-0 top-0 h-full w-full bg-[linear-gradient(110deg,rgba(22,11,45,0.98)_0%,rgba(22,11,45,0.94)_42%,rgba(22,11,45,0.25)_100%)]" />

        {/* Small decorative texture */}
        <div
          className="absolute bottom-10 left-10 h-48 w-48 opacity-[0.12]"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2 lg:gap-14">

        {/* Left content */}
        <div className="relative z-10 max-w-2xl">

          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-300/25 bg-white/[0.07] px-4 py-2 backdrop-blur-md">
            <Sparkles size={15} className="text-violet-300" />
            <span className="text-[11px] font-bold tracking-[0.14em] text-violet-200">
              AI-POWERED IMAGE EDITING
            </span>
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.12] tracking-[-0.05em] text-white sm:text-5xl lg:text-[66px]">
            Your images.
            <br />
            A cleaner look.
            <br />
            <span className="text-[#B99AFF]">
              Instantly.
            </span>
          </h1>

          <p className="mt-7 max-w-lg text-base leading-8 text-violet-100/70 sm:text-lg">
            Remove backgrounds from your images in seconds with the power
            of AI. Create clean, professional visuals without complicated
            editing tools.
          </p>

          {/* Buttons */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">

            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="group inline-flex items-center justify-center gap-3 rounded-xl bg-white px-7 py-4 text-sm font-bold text-[#32145F] shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#DCCAFF]"
            >
              Start Creating
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-7 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-violet-300/50 hover:bg-white/10"
            >
              See How It Works
              <MoveUpRight size={15} />
            </a>
          </div>

          {/* Benefits */}
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
            {[
              'Simple to use',
              'Fast AI processing',
              'Easy downloads',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-xs font-medium text-violet-100/70"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-400/20">
                  <Check size={12} className="text-violet-200" />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Right product composition */}
        <div className="relative mx-auto w-full max-w-[570px] lg:ml-auto">

          {/* Decorative purple backing */}
          <div className="absolute -inset-5 rotate-3 rounded-[2.5rem] bg-gradient-to-br from-violet-400/40 via-purple-600/30 to-fuchsia-500/20" />

          <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full border border-white/20" />

          {/* AI badge */}
          <div className="absolute -left-4 top-12 z-20 flex items-center gap-2.5 rounded-2xl border border-white/50 bg-white px-4 py-3 shadow-2xl sm:-left-10">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <WandSparkles size={19} />
            </div>

            <div>
              <p className="text-xs font-bold text-gray-900">
                AI Processing
              </p>
              <p className="mt-0.5 text-[10px] text-gray-500">
                Background removed
              </p>
            </div>
          </div>

          {/* Main editor */}
          <div className="relative overflow-hidden rounded-[1.8rem] border border-white/70 bg-white p-3 text-gray-900 shadow-2xl shadow-black/30 sm:p-5">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-2 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white">
                  <ImageIcon size={17} />
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-900">
                    Pixclear Studio
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-400">
                    Image editor
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Ready
              </span>
            </div>

            {/* Comparison */}
            <div className="grid grid-cols-2 gap-3 py-5">

              {/* Original */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-500">
                    Original
                  </span>
                  <span className="rounded-md bg-gray-100 px-2 py-1 text-[9px] text-gray-500">
                    JPG
                  </span>
                </div>

                <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-orange-100 via-amber-50 to-orange-200">

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.8),transparent_45%)]" />

                  <div className="absolute bottom-0 h-1/2 w-full bg-gradient-to-t from-orange-300/40 to-transparent" />

                  <div className="relative flex h-[72%] w-[65%] items-center justify-center rounded-[45%_45%_20%_20%] bg-gradient-to-br from-amber-500 via-orange-500 to-orange-700 shadow-xl">
                    <div className="absolute left-1/2 top-[12%] h-[34%] w-[52%] -translate-x-1/2 rounded-full bg-amber-100 shadow-inner" />
                    <div className="absolute bottom-[18%] h-[28%] w-[90%] rounded-t-[50%] bg-orange-900/40" />
                  </div>

                  <span className="absolute bottom-3 left-3 rounded-md bg-white/85 px-2 py-1 text-[9px] font-medium text-gray-600">
                    Original background
                  </span>
                </div>
              </div>

              {/* Processed */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-500">
                    Processed
                  </span>
                  <span className="rounded-md bg-violet-50 px-2 py-1 text-[9px] font-semibold text-violet-600">
                    PNG
                  </span>
                </div>

                <div
                  className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-xl"
                  style={{
                    backgroundColor: '#fff',
                    backgroundImage: `
                      linear-gradient(45deg, #eeeeee 25%, transparent 25%),
                      linear-gradient(-45deg, #eeeeee 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, #eeeeee 75%),
                      linear-gradient(-45deg, transparent 75%, #eeeeee 75%)
                    `,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                  }}
                >
                  <div className="relative flex h-[72%] w-[65%] items-center justify-center rounded-[45%_45%_20%_20%] bg-gradient-to-br from-amber-500 via-orange-500 to-orange-700 shadow-xl">
                    <div className="absolute left-1/2 top-[12%] h-[34%] w-[52%] -translate-x-1/2 rounded-full bg-amber-100 shadow-inner" />
                    <div className="absolute bottom-[18%] h-[28%] w-[90%] rounded-t-[50%] bg-orange-900/40" />
                  </div>

                  <span className="absolute bottom-3 left-3 rounded-md bg-white px-2 py-1 text-[9px] font-semibold text-violet-600 shadow-sm">
                    Transparent PNG
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between rounded-xl bg-violet-50 p-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-violet-600">
                  <ShieldCheck size={17} />
                </div>

                <div>
                  <p className="text-[11px] font-bold text-gray-800">
                    Clean results
                  </p>
                  <p className="mt-0.5 text-[9px] text-gray-500">
                    Ready for your next project
                  </p>
                </div>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white">
                <Check size={16} />
              </div>
            </div>
          </div>

          {/* Powered by AI */}
          <div className="absolute -bottom-6 right-3 z-20 flex items-center gap-2 rounded-xl border border-white/60 bg-white px-4 py-3 shadow-2xl sm:-right-5">
            <Zap size={17} className="text-amber-500" />
            <span className="text-xs font-bold text-gray-700">
              Powered by AI
            </span>
          </div>

        </div>
      </div>

      {/* Bottom transition */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#21103F] to-transparent" />
    </section>
  )
}

export default Hero
