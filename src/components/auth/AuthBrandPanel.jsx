
import {
  Sparkles,
  Image,
  ShieldCheck,
  WandSparkles,
  Check,
  Scan,
  Layers3,
} from 'lucide-react'

const AuthBrandPanel = ({ variant = 'login' }) => {
  const isSignup = variant === 'signup'

  return (
    <aside className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#170C2C] p-10 text-white lg:flex xl:p-14">

      {/* Background atmosphere */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-[450px] w-[450px] rounded-full bg-violet-600/30 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-[450px] w-[450px] rounded-full bg-fuchsia-600/20 blur-[110px]" />

      {/* Decorative rings */}
      <div className="pointer-events-none absolute -right-32 top-20 h-[500px] w-[500px] rounded-full border border-white/[0.07]" />
      <div className="pointer-events-none absolute -right-20 top-32 h-[400px] w-[400px] rounded-full border border-white/[0.07]" />
      <div className="pointer-events-none absolute -right-8 top-44 h-[300px] w-[300px] rounded-full border border-white/[0.07]" />

      {/* Dot texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'linear-gradient(to bottom, black, transparent 85%)',
        }}
      />

      {/* Brand */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 shadow-lg shadow-violet-950/30 backdrop-blur-xl">
            <Sparkles size={20} className="text-violet-200" />
          </div>

          <span className="text-[27px] font-black tracking-[-0.07em]">
            pixclear<span className="text-violet-400">.</span>
          </span>
        </div>

        <p className="ml-1 mt-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-violet-200/60">
          A clearer creative experience
        </p>
      </div>

      {/* Main content */}
      <div className="relative z-10 my-12 max-w-xl">

        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/10 px-4 py-2 backdrop-blur-xl">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
          <span className="text-[11px] font-bold tracking-wide text-violet-100">
            YOUR CREATIVE SPACE STARTS HERE
          </span>
        </div>

        <h2 className="max-w-lg text-[42px] font-extrabold leading-[1.13] tracking-[-0.055em] xl:text-[50px]">
          {isSignup ? (
            <>
              Create without
              <br />
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
                limitations.
              </span>
            </>
          ) : (
            <>
              Give every image
              <br />
              a{' '}
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
                cleaner look.
              </span>
            </>
          )}
        </h2>

        <p className="mt-6 max-w-md text-sm leading-8 text-violet-100/65 xl:text-[15px]">
          {isSignup
            ? 'Join Pixclear and discover a simpler way to remove backgrounds, transform images, and bring your creative ideas to life.'
            : 'Transform ordinary images into clean, professional visuals. Remove distractions and let your creativity stand out.'}
        </p>

        {/* Product visual */}
        <div className="relative mt-12 max-w-[440px]">

          {/* Glow behind preview */}
          <div className="absolute inset-10 rounded-full bg-violet-500/30 blur-[65px]" />

          <div className="relative overflow-hidden rounded-[25px] border border-white/15 bg-white/[0.07] p-4 shadow-[0_25px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl">

            {/* Preview header */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20">
                  <Image size={16} className="text-violet-200" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Pixclear Studio</p>
                  <p className="mt-0.5 text-[9px] text-violet-200/50">
                    Image workspace
                  </p>
                </div>
              </div>

              <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-bold text-emerald-300">
                READY
              </span>
            </div>

            {/* Image comparison */}
            <div className="grid grid-cols-2 gap-3">

              {/* Original */}
              <div className="overflow-hidden rounded-xl border border-white/10 bg-[#26183B] p-2">
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-violet-200/60">
                  Original
                </p>

                <div className="relative flex h-[145px] items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#B8A1C8] via-[#8E79A9] to-[#4B3A69]">
                  <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: 'linear-gradient(135deg, transparent 48%, rgba(255,255,255,.2) 49%, transparent 50%)',
                    backgroundSize: '18px 18px',
                  }} />

                  <div className="relative flex h-[105px] w-[76px] items-center justify-center rounded-[42%_42%_35%_35%] bg-gradient-to-b from-[#F7D2B0] to-[#B97870] shadow-2xl">
                    <div className="absolute -top-3 h-12 w-[82px] rounded-t-full bg-[#30202D]" />
                    <div className="absolute top-[40px] flex gap-5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#30202D]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-[#30202D]" />
                    </div>
                    <div className="absolute bottom-6 h-2 w-5 rounded-full bg-[#9C555B]" />
                  </div>
                </div>
              </div>

              {/* Processed */}
              <div className="overflow-hidden rounded-xl border border-violet-300/20 bg-[#26183B] p-2">
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-violet-200/60">
                  Processed
                </p>

                <div
                  className="relative flex h-[145px] items-center justify-center overflow-hidden rounded-lg"
                  style={{
                    backgroundImage: 'linear-gradient(45deg, #443653 25%, transparent 25%), linear-gradient(-45deg, #443653 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #443653 75%), linear-gradient(-45deg, transparent 75%, #443653 75%)',
                    backgroundSize: '16px 16px',
                    backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0',
                    backgroundColor: '#30223F',
                  }}
                >
                  <div className="flex h-[105px] w-[76px] items-center justify-center rounded-[42%_42%_35%_35%] bg-gradient-to-b from-[#F7D2B0] to-[#B97870] shadow-[0_0_30px_rgba(196,160,255,0.25)]">
                    <div className="absolute -mt-[83px] h-12 w-[82px] rounded-t-full bg-[#30202D]" />
                    <div className="absolute mt-[-25px] flex gap-5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#30202D]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-[#30202D]" />
                    </div>
                    <div className="absolute mt-10 h-2 w-5 rounded-full bg-[#9C555B]" />
                  </div>

                  <div className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-[#102D23] shadow-lg">
                    <Check size={14} strokeWidth={3} />
                  </div>
                </div>
              </div>
            </div>

            {/* Processing status */}
            <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.05] px-3 py-3">
              <div className="flex items-center gap-2.5">
                <WandSparkles size={16} className="text-violet-300" />
                <div>
                  <p className="text-[10px] font-bold text-white">
                    AI Background Removal
                  </p>
                  <p className="mt-0.5 text-[9px] text-violet-200/50">
                    Clean results, less effort
                  </p>
                </div>
              </div>

              <Scan size={18} className="text-violet-300" />
            </div>
          </div>

          {/* Floating feature badge */}
          <div className="absolute -right-5 top-12 hidden items-center gap-2 rounded-xl border border-white/15 bg-[#302044]/90 px-3 py-2.5 shadow-xl backdrop-blur-xl xl:flex">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/15">
              <ShieldCheck size={15} className="text-emerald-300" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white">Quality results</p>
              <p className="text-[9px] text-violet-200/50">Made simple</p>
            </div>
          </div>

          {/* Floating layers badge */}
          <div className="absolute -bottom-5 -left-5 hidden items-center gap-2 rounded-xl border border-white/15 bg-[#302044]/90 px-3 py-2.5 shadow-xl backdrop-blur-xl xl:flex">
            <Layers3 size={17} className="text-fuchsia-300" />
            <span className="text-[10px] font-bold text-white">
              Creative freedom
            </span>
          </div>
        </div>

        {/* Feature list */}
        <div className="mt-12 flex flex-wrap gap-x-7 gap-y-4">
          <div className="flex items-center gap-2 text-[11px] font-medium text-violet-100/70">
            <Check size={14} className="text-violet-300" />
            Easy to use
          </div>

          <div className="flex items-center gap-2 text-[11px] font-medium text-violet-100/70">
            <Check size={14} className="text-violet-300" />
            Fast processing
          </div>

          <div className="flex items-center gap-2 text-[11px] font-medium text-violet-100/70">
            <Check size={14} className="text-violet-300" />
            Clean downloads
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6">
        <p className="text-[10px] font-medium tracking-wide text-violet-200/40">
          © {new Date().getFullYear()} Pixclear. All rights reserved.
        </p>

        <div className="flex items-center gap-2 text-[10px] text-violet-200/50">
          <ShieldCheck size={13} />
          Secure creative workspace
        </div>
      </div>
    </aside>
  )
}

export default AuthBrandPanel
