
import { useState } from 'react'
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  UploadCloud,
  Zap,
  FolderOpen,
  ShieldCheck,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  FileImage,
} from 'lucide-react'

import DashboardLayout from '../../layouts/DashboardLayout'
import DashboardHeader from '../../components/dashboard/DashboardHeader'

const faqCategories = [
  {
    title: 'Getting Started',
    icon: UploadCloud,
    questions: [
      {
        question: 'How do I remove an image background?',
        answer:
          'Open your Pixclear dashboard and use the upload section to select an image. Your image will open in the workspace, where you can start the background-removal process.',
      },
      {
        question: 'Which image formats are supported?',
        answer:
          'Pixclear currently accepts PNG, JPEG and WebP images for uploads.',
      },
      {
        question: 'What is the maximum image upload size?',
        answer:
          'The current upload limit is 22 MB per image. If your image exceeds this limit, compress or resize it before uploading.',
      },
    ],
  },
  {
    title: 'Image Processing',
    icon: Zap,
    questions: [
      {
        question: 'How long does background removal take?',
        answer:
          'Processing time depends on the image size, server response and processing service availability. Keep your browser open while processing is in progress.',
      },
      {
        question: 'What happens after background removal?',
        answer:
          'Once processing is successful, you can preview the result in your workspace, download it, and save the project to your account.',
      },
      {
        question: 'What should I do if image processing fails?',
        answer:
          'Check your internet connection, ensure the image is a supported format and under 22 MB, then try again. If the issue continues, refresh the page and retry.',
      },
    ],
  },
  {
    title: 'Projects & Account',
    icon: FolderOpen,
    questions: [
      {
        question: 'Where can I find my saved projects?',
        answer:
          'Open My Projects from the dashboard sidebar. You can view your saved projects, preview images, download results and delete projects.',
      },
      {
        question: 'Can I delete a saved project?',
        answer:
          'Yes. Open My Projects and use the delete icon on the project you want to remove. You will be asked to confirm before deletion.',
      },
      {
        question: 'Why can’t I see my latest project?',
        answer:
          'Make sure the project was successfully saved. You can also use the refresh option on the My Projects page to reload your saved projects.',
      },
      {
        question: 'How do I sign out?',
        answer:
          'Open your profile menu in the dashboard header and select Log Out.',
      },
    ],
  },
]

const troubleshooting = [
  {
    title: 'Image refuses to upload',
    description:
      'Confirm that your image is PNG, JPEG or WebP and does not exceed 22 MB.',
    icon: FileImage,
  },
  {
    title: 'Processing is taking too long',
    description:
      'Check your internet connection and retry. Processing also depends on external service availability.',
    icon: Zap,
  },
  {
    title: 'Projects are not showing',
    description:
      'Visit My Projects and select Refresh Projects to reload your saved project history.',
    icon: FolderOpen,
  },
]

const Support = () => {
  const [search, setSearch] = useState('')
  const [activeQuestion, setActiveQuestion] = useState(null)

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter((item) => {
        const query = search.trim().toLowerCase()

        return (
          !query ||
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
        )
      }),
    }))
    .filter((category) => category.questions.length > 0)

  const toggleQuestion = (id) => {
    setActiveQuestion((current) => current === id ? null : id)
  }

  return (
    <DashboardLayout>
      {({ onMenuClick }) => (
        <div className="min-h-screen bg-[#FAF9FC]">
          <DashboardHeader onMenuClick={onMenuClick} />

          <main className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

            {/* Hero */}
            <section className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-[#302052] via-[#493078] to-[#7454C5] px-6 py-10 text-white shadow-xl shadow-[#6044A8]/10 sm:px-10 sm:py-12">
              <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-[#B69AFF]/20 blur-3xl" />

              <div className="relative z-10 max-w-2xl">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                  <HelpCircle size={25} />
                </div>

                <p className="mb-2 text-sm font-semibold text-[#D8CAFF]">
                  PIXCLEAR SUPPORT CENTRE
                </p>

                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  How can we help you?
                </h1>

                <p className="mt-3 max-w-lg text-sm leading-7 text-white/75 sm:text-base">
                  Find answers, learn how to use Pixclear and troubleshoot
                  common issues with your image projects.
                </p>

                <div className="relative mt-7 max-w-lg">
                  <Search
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A79BBF]"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value)
                      setActiveQuestion(null)
                    }}
                    placeholder="Search for answers..."
                    className="w-full rounded-xl border border-white/20 bg-white py-4 pl-12 pr-4 text-sm text-[#30243F] outline-none placeholder:text-[#A79BBF] focus:ring-4 focus:ring-white/20"
                  />
                </div>
              </div>
            </section>

            {/* Quick help categories */}
            <section className="mb-10">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-[#292233]">
                  Browse Help Topics
                </h2>

                <p className="mt-1 text-sm text-[#968EA0]">
                  Explore guides based on what you need help with.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  {
                    title: 'Getting Started',
                    description: 'Learn the basics of Pixclear.',
                    icon: UploadCloud,
                    color: 'bg-[#F0EBFF] text-[#8060D8]',
                  },
                  {
                    title: 'Image Processing',
                    description: 'Understand image editing and results.',
                    icon: ImageIcon,
                    color: 'bg-[#EAF5FF] text-[#3994D8]',
                  },
                  {
                    title: 'Projects & Account',
                    description: 'Manage your projects and account.',
                    icon: ShieldCheck,
                    color: 'bg-[#EAF7F0] text-[#239B62]',
                  },
                ].map((item) => {
                  const Icon = item.icon

                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-[#EEE9F4] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}>
                        <Icon size={21} />
                      </div>

                      <h3 className="text-sm font-bold text-[#292233]">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-xs leading-6 text-[#968EA0]">
                        {item.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* FAQ */}
            <section className="mb-10">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-[#292233]">
                  Frequently Asked Questions
                </h2>

                <p className="mt-1 text-sm text-[#968EA0]">
                  Find quick answers to common questions.
                </p>
              </div>

              {filteredCategories.length > 0 ? (
                <div className="space-y-6">
                  {filteredCategories.map((category) => {
                    const CategoryIcon = category.icon

                    return (
                      <div
                        key={category.title}
                        className="overflow-hidden rounded-2xl border border-[#EEE9F4] bg-white shadow-sm"
                      >
                        <div className="flex items-center gap-3 border-b border-[#F0EDF3] px-5 py-4">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0EBFF] text-[#8060D8]">
                            <CategoryIcon size={18} />
                          </div>

                          <h3 className="text-sm font-bold text-[#393143]">
                            {category.title}
                          </h3>
                        </div>

                        <div className="divide-y divide-[#F0EDF3]">
                          {category.questions.map((item) => {
                            const id = `${category.title}-${item.question}`
                            const isOpen = activeQuestion === id

                            return (
                              <div key={id}>
                                <button
                                  onClick={() => toggleQuestion(id)}
                                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-[#FCFBFE]"
                                >
                                  <span className="text-sm font-semibold text-[#393143]">
                                    {item.question}
                                  </span>

                                  {isOpen ? (
                                    <ChevronUp
                                      size={18}
                                      className="shrink-0 text-[#8060D8]"
                                    />
                                  ) : (
                                    <ChevronDown
                                      size={18}
                                      className="shrink-0 text-[#A49BAF]"
                                    />
                                  )}
                                </button>

                                {isOpen && (
                                  <div className="px-5 pb-5">
                                    <p className="rounded-xl bg-[#F8F6FC] p-4 text-sm leading-7 text-[#81798D]">
                                      {item.answer}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#DED6E9] bg-white px-6 py-12 text-center">
                  <Search size={30} className="mx-auto mb-3 text-[#B3A9C4]" />

                  <h3 className="font-bold text-[#393143]">
                    No answers found
                  </h3>

                  <p className="mt-2 text-sm text-[#968EA0]">
                    Try another search term.
                  </p>

                  <button
                    onClick={() => setSearch('')}
                    className="mt-4 text-sm font-bold text-[#8060D8]"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </section>

            {/* Troubleshooting */}
            <section className="mb-10">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-[#292233]">
                  Quick Troubleshooting
                </h2>

                <p className="mt-1 text-sm text-[#968EA0]">
                  Try these steps when something isn't working as expected.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {troubleshooting.map((item) => {
                  const Icon = item.icon

                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-[#EEE9F4] bg-white p-5 shadow-sm"
                    >
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF4E8] text-[#D58A36]">
                        <Icon size={20} />
                      </div>

                      <h3 className="text-sm font-bold text-[#393143]">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-xs leading-6 text-[#968EA0]">
                        {item.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Upload requirements */}
            <section className="mb-10 rounded-2xl border border-[#EEE9F4] bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0EBFF] text-[#8060D8]">
                  <ImageIcon size={22} />
                </div>

                <div>
                  <h2 className="text-base font-bold text-[#292233]">
                    Image Upload Requirements
                  </h2>

                  <p className="mt-1 text-xs text-[#968EA0]">
                    Check these requirements before uploading.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { label: 'PNG', description: 'Supported format' },
                  { label: 'JPEG', description: 'Supported format' },
                  { label: 'WebP', description: 'Supported format' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl bg-[#F8F6FC] p-4"
                  >
                    <CheckCircle2 size={19} className="text-[#32A36E]" />

                    <div>
                      <p className="text-sm font-bold text-[#393143]">
                        {item.label}
                      </p>

                      <p className="mt-1 text-xs text-[#968EA0]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#F8F6FC] p-4">
                <AlertCircle size={19} className="shrink-0 text-[#8060D8]" />

                <p className="text-sm text-[#716A7B]">
                  Maximum supported upload size: <strong>22 MB</strong>
                </p>
              </div>
            </section>

            {/* Contact section */}
            <section className="rounded-2xl border border-[#E8DFFC] bg-[#F5F1FF] p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#8060D8] shadow-sm">
                    <MessageCircle size={23} />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-[#6044A8]">
                      Still need help?
                    </h2>

                    <p className="mt-2 max-w-lg text-sm leading-6 text-[#82729F]">
                      If you continue experiencing issues, reach out through
                      the support contact provided by the Pixclear team.
                    </p>
                  </div>
                </div>

                <a
                  href="mailto:adelowoolaoluwa30@gmail.com"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#8060D8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6D50C2]"
                >
                  Contact Support
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </section>

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

export default Support
