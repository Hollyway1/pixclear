
import {
  Scissors,
  Zap,
  Image,
  Layers,
  Palette,
  Download,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react'

const features = [
  {
    icon: Scissors,
    number: '01',
    title: 'AI Background Removal',
    description:
      'Separate your subject from unwanted backgrounds with intelligent AI-powered processing.',
    accent: 'violet',
  },
  {
    icon: Zap,
    number: '02',
    title: 'Fast Processing',
    description:
      'Spend less time editing and more time creating. Get your processed images in seconds.',
    accent: 'amber',
  },
  {
    icon: Image,
    number: '03',
    title: 'Quality Results',
    description:
      'Create clean, professional-looking images ready for your creative projects.',
    accent: 'blue',
  },
  {
    icon: Layers,
    number: '04',
    title: 'Transparent Background',
    description:
      'Export images with transparent backgrounds for flexible use across your designs.',
    accent: 'emerald',
  },
  {
    icon: Palette,
    number: '05',
    title: 'Creative Freedom',
    description:
      'Prepare your images for product displays, graphics, presentations and social media.',
    accent: 'pink',
  },
  {
    icon: Download,
    number: '06',
    title: 'Easy Downloads',
    description:
      'Download your processed images and keep your creative workflow moving.',
    accent: 'orange',
  },
]

const accentStyles = {
  violet: {
    icon: 'bg-violet-100 text-violet-700 group-hover:bg-violet-600 group-hover:text-white',
    line: 'group-hover:bg-violet-600',
  },
  amber: {
    icon: 'bg-amber-100 text-amber-700 group-hover:bg-amber-500 group-hover:text-white',
    line: 'group-hover:bg-amber-500',
  },
  blue: {
    icon: 'bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white',
    line: 'group-hover:bg-blue-600',
  },
  emerald: {
    icon: 'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white',
    line: 'group-hover:bg-emerald-600',
  },
  pink: {
    icon: 'bg-pink-100 text-pink-700 group-hover:bg-pink-600 group-hover:text-white',
    line: 'group-hover:bg-pink-600',
  },
  orange: {
    icon: 'bg-orange-100 text-orange-700 group-hover:bg-orange-500 group-hover:text-white',
    line: 'group-hover:bg-orange-500',
  },
}

function Features() {
  return (
    <section
      id="features"
      className="relative isolate overflow-hidden bg-[#F7F5FC] px-5 py-24 sm:py-32"
    >

      {/* Background composition */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">

        {/* Large violet curved shape */}
        <div className="absolute -right-[25%] -top-[35%] h-[750px] w-[750px] rounded-full bg-[#E8DDFB]" />

        <div className="absolute -left-[20%] -bottom-[40%] h-[650px] w-[650px] rounded-full bg-[#EDE5FA]" />

        {/* Sculptural side detail */}
        <div className="absolute -right-24 top-[35%] hidden h-[460px] w-[280px] rotate-12 rounded-[100px] bg-gradient-to-br from-violet-200/70 to-purple-100/20 lg:block" />

        {/* Decorative image-frame outlines */}
        <div className="absolute right-[7%] top-20 hidden h-40 w-40 rounded-[2rem] border border-violet-300/40 rotate-12 lg:block" />

        <div className="absolute bottom-16 left-[5%] hidden h-32 w-32 rounded-full border-[18px] border-white/70 lg:block" />

        {/* Subtle surface texture */}
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              'radial-gradient(#9B7ACB 0.7px, transparent 0.7px)',
            backgroundSize: '22px 22px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl">

        {/* Section heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-2 shadow-sm">
            <Sparkles size={14} className="text-violet-600" />

            <span className="text-[11px] font-bold tracking-[0.12em] text-violet-700">
              WHAT MAKES PIXCLEAR DIFFERENT
            </span>
          </div>

          <h2 className="text-3xl font-extrabold leading-tight tracking-[-0.045em] text-gray-950 sm:text-4xl lg:text-5xl">
            Everything you need.
            <br />
            <span className="text-violet-700">
              Nothing complicated.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
            Powerful AI technology meets a simple creative workflow.
            Get professional image results without the complexity
            of traditional editing software.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {features.map((feature) => {
            const Icon = feature.icon
            const accent = accentStyles[feature.accent]

            return (
              <article
                key={feature.title}
                className="group relative isolate overflow-hidden rounded-[1.7rem] border border-white/90 bg-white/85 p-7 shadow-[0_12px_40px_rgba(51,30,91,0.04)] backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-violet-200 hover:bg-white hover:shadow-[0_25px_55px_rgba(75,40,130,0.12)] sm:p-8"
              >

                {/* Hover background decoration */}
                <div className="pointer-events-none absolute -right-16 -top-16 -z-10 h-40 w-40 rounded-full bg-violet-100/0 transition-all duration-500 group-hover:bg-violet-100/80" />

                {/* Top row */}
                <div className="flex items-center justify-between">

                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:rotate-[-6deg] group-hover:scale-110 ${accent.icon}`}
                  >
                    <Icon size={25} strokeWidth={1.8} />
                  </div>

                  <span className="text-xs font-bold tracking-[0.15em] text-gray-300 transition-colors group-hover:text-violet-500">
                    {feature.number}
                  </span>
                </div>

                {/* Card content */}
                <h3 className="mt-9 text-lg font-bold tracking-tight text-gray-950">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  {feature.description}
                </p>

                {/* Bottom accent */}
                <div className="mt-8 flex items-center justify-between">
                  <span
                    className={`h-1 w-10 rounded-full bg-violet-200 transition-all duration-300 group-hover:w-16 ${accent.line}`}
                  />

                  <ArrowUpRight
                    size={18}
                    className="text-gray-300 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-violet-600"
                  />
                </div>

              </article>
            )
          })}

        </div>

        {/* Bottom section statement */}
        <div className="mt-16 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
          <span className="h-px w-12 bg-violet-300" />

          <p className="text-xs font-semibold tracking-wide text-violet-700">
            Less editing complexity. More creative possibilities.
          </p>

          <span className="h-px w-12 bg-violet-300" />
        </div>

      </div>
    </section>
  )
}

export default Features
