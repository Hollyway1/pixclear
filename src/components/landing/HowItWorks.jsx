
import {
  UploadCloud,
  WandSparkles,
  Download,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Image as ImageIcon,
  Layers3,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const steps = [
  {
    number: '01',
    icon: UploadCloud,
    title: 'Upload Your Image',
    description:
      'Choose an image from your device. Drag and drop your file or browse to get started.',
    details: ['JPG and PNG supported', 'Quick and simple upload'],
    label: 'YOUR ORIGINAL IMAGE',
  },
  {
    number: '02',
    icon: WandSparkles,
    title: 'Let Pixclear Work',
    description:
      'Our AI-powered technology detects your subject and automatically removes the background.',
    details: ['Automatic AI processing', 'Clean subject separation'],
    label: 'AI PROCESSING',
  },
  {
    number: '03',
    icon: Download,
    title: 'Download Your Image',
    description:
      'Get your processed image with a transparent background, ready for your next project.',
    details: ['Transparent PNG output', 'Ready to use anywhere'],
    label: 'YOUR FINAL RESULT',
  },
]

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="relative isolate overflow-hidden bg-[#140B25] px-5 py-24 text-white sm:py-32"
    >

      {/* Background composition */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">

        <div className="absolute -left-48 top-[-30%] h-[650px] w-[650px] rounded-full bg-[#542A94]/30 blur-[100px]" />

        <div className="absolute -right-40 bottom-[-35%] h-[700px] w-[700px] rounded-full bg-violet-700/25 blur-[100px]" />

        {/* Large curved design */}
        <div className="absolute -right-[25%] top-[10%] h-[700px] w-[700px] rounded-full border-[90px] border-violet-400/[0.06]" />

        <div className="absolute -right-[18%] top-[18%] h-[550px] w-[550px] rounded-full border border-violet-300/15" />

        {/* Subtle texture */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(#C4A7FF 0.8px, transparent 0.8px)',
            backgroundSize: '25px 25px',
          }}
        />

        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-violet-400/[0.08] to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl">

        {/* Section heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-white/[0.06] px-4 py-2 backdrop-blur-md">
            <Sparkles size={14} className="text-violet-300" />

            <span className="text-[11px] font-bold tracking-[0.14em] text-violet-200">
              SIMPLE BY DESIGN
            </span>
          </div>

          <h2 className="text-3xl font-extrabold leading-tight tracking-[-0.045em] text-white sm:text-4xl lg:text-5xl">
            From upload to
            <br />
            <span className="text-[#B99AFF]">
              extraordinary in seconds.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-violet-100/65 sm:text-base">
            Professional background removal doesn't have to be complicated.
            Pixclear makes the entire process simple, fast, and effortless.
          </p>
        </div>

        {/* Workflow overview */}
        <div className="relative">

          {/* Connecting line */}
          <div className="absolute left-[16%] right-[16%] top-[43px] hidden h-px bg-gradient-to-r from-violet-500/20 via-violet-400/70 to-violet-500/20 md:block" />

          <div className="grid gap-6 md:grid-cols-3">

            {steps.map((step, index) => {
              const Icon = step.icon

              return (
                <article
                  key={step.number}
                  className="group relative flex flex-col overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#211435] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-violet-400/40 hover:bg-[#281943] hover:shadow-2xl hover:shadow-violet-950/30 sm:p-8"
                >

                  {/* Card background lighting */}
                  <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-500/0 blur-3xl transition-all duration-500 group-hover:bg-violet-500/15" />

                  {/* Step number and icon */}
                  <div className="relative flex items-center justify-between">

                    <span className="text-sm font-bold tracking-[0.16em] text-violet-300/70">
                      STEP {step.number}
                    </span>

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/15 bg-violet-400/10 text-violet-200 transition-all duration-300 group-hover:scale-110 group-hover:border-violet-300/40 group-hover:bg-violet-500 group-hover:text-white">
                      <Icon size={25} strokeWidth={1.8} />
                    </div>
                  </div>

                  {/* Workflow visual */}
                  <div className="relative mt-9 flex h-40 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.07] bg-[#180E2B]">

                    {index === 0 && (
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-violet-300/40 bg-violet-400/10 text-violet-300 transition-transform duration-500 group-hover:-translate-y-2">
                          <UploadCloud size={32} strokeWidth={1.5} />
                        </div>
                        <span className="text-[10px] font-semibold tracking-widest text-violet-200/60">
                          DROP YOUR IMAGE
                        </span>
                      </div>
                    )}

                    {index === 1 && (
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-violet-300/20 bg-violet-400/[0.08]">
                        <div className="absolute inset-2 rounded-full border border-violet-300/20" />
                        <div className="absolute inset-[-10px] rounded-full border border-dashed border-violet-300/30 transition-transform duration-700 group-hover:rotate-45" />
                        <WandSparkles size={38} className="text-violet-200 transition-transform duration-500 group-hover:scale-125" />
                        <Sparkles size={15} className="absolute right-[-15px] top-0 text-fuchsia-300" />
                        <Sparkles size={12} className="absolute bottom-0 left-[-13px] text-violet-300" />
                      </div>
                    )}

                    {index === 2 && (
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-400/10 transition-transform duration-500 group-hover:-translate-y-2">
                        <div className="absolute inset-0 opacity-20"
                          style={{
                            backgroundImage: `
                              linear-gradient(45deg, #A78BFA 25%, transparent 25%),
                              linear-gradient(-45deg, #A78BFA 25%, transparent 25%),
                              linear-gradient(45deg, transparent 75%, #A78BFA 75%),
                              linear-gradient(-45deg, transparent 75%, #A78BFA 75%)
                            `,
                            backgroundSize: '14px 14px',
                            backgroundPosition: '0 0, 0 7px, 7px -7px, -7px 0px',
                          }}
                        />
                        <Download size={36} className="relative text-violet-100" />
                        <CheckCircle2 size={18} className="absolute -right-2 -top-2 rounded-full bg-[#211435] text-emerald-400" />
                      </div>
                    )}

                    <span className="absolute bottom-3 left-3 text-[9px] font-bold tracking-[0.12em] text-violet-200/40">
                      {step.label}
                    </span>
                  </div>

                  {/* Card content */}
                  <h3 className="mt-8 text-xl font-bold tracking-tight text-white">
                    {step.title}
                  </h3>

                  <p className="mt-3 min-h-[84px] text-sm leading-7 text-violet-100/60">
                    {step.description}
                  </p>

                  <div className="my-6 h-px w-full bg-white/10" />

                  {/* Details */}
                  <div className="mt-auto space-y-3">
                    {step.details.map((detail) => (
                      <div
                        key={detail}
                        className="flex items-center gap-2.5 text-sm font-medium text-violet-100/80"
                      >
                        <CheckCircle2
                          size={16}
                          className="shrink-0 text-violet-300"
                        />
                        {detail}
                      </div>
                    ))}
                  </div>

                  {/* Step indicator */}
                  <div className="mt-8 flex items-center justify-between">
                    <span className="h-1 w-10 rounded-full bg-violet-500/40 transition-all duration-300 group-hover:w-16 group-hover:bg-violet-400" />

                    {index !== steps.length - 1 && (
                      <span className="text-[10px] font-bold tracking-widest text-violet-300/40">
                        NEXT STEP
                      </span>
                    )}
                  </div>
                </article>
              )
            })}

          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 flex flex-col items-center text-center">

          <div className="mb-4 flex items-center gap-2 text-violet-300">
            <Layers3 size={17} />
            <span className="text-[11px] font-bold tracking-[0.14em]">
              YOUR CREATIVE WORKFLOW STARTS HERE
            </span>
          </div>

          <p className="text-sm text-violet-100/60">
            Your next great image is just a few clicks away.
          </p>

          <Link
            to="/signup"
            className="group mt-6 inline-flex items-center gap-3 rounded-xl bg-white px-7 py-4 text-sm font-bold text-[#32145F] shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#DCCAFF]"
          >
            Try Pixclear Free

            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

      </div>
    </section>
  )
}

export default HowItWorks
