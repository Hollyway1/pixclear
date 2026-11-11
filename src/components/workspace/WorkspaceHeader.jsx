
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Sparkles,
  CircleHelp,
  UserCircle,
} from 'lucide-react'

const WorkspaceHeader = () => {
  const menuItems = ['Projects', 'Help', 'Review', 'Upscale', 'Enhance']

  return (
    <header className="flex min-h-[72px] items-center justify-between gap-4 border-b border-gray-100 bg-white px-4 sm:px-7">

      <div className="flex items-center gap-4">
        <Link
          to="/dashboard"
          aria-label="Back to dashboard"
          className="rounded-lg p-2 text-gray-500 transition hover:bg-violet-50 hover:text-violet-600"
        >
          <ArrowLeft size={19} />
        </Link>

        <Link
          to="/"
          className="flex items-center gap-1 text-xl font-extrabold tracking-tight text-violet-700"
        >
          pixclear<span className="text-violet-400">.</span>
          <Sparkles size={15} />
        </Link>
      </div>

      <nav className="hidden items-center gap-6 lg:flex">
        {menuItems.map((item) => (
          <button
            key={item}
            type="button"
            disabled
            title="Coming soon"
            className="cursor-not-allowed text-xs font-medium text-gray-400"
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button
          type="button"
          title="Help and support coming soon"
          className="rounded-full p-2 text-gray-500 hover:bg-violet-50 hover:text-violet-600"
        >
          <CircleHelp size={19} />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-700">
          <UserCircle size={22} />
        </div>
      </div>
    </header>
  )
}

export default WorkspaceHeader
