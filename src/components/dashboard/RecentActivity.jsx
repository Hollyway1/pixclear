
import { useEffect, useState } from 'react'
import {
  Clock3,
  ImagePlus,
  ArrowRight,
  Image as ImageIcon,
  RefreshCw,
  Eye,
  Download,
  Trash2,
  X,
  ExternalLink,
  AlertCircle,
} from 'lucide-react'

import { Link } from 'react-router-dom'
import {
  getProjects,
  deleteProject,
} from '../../services/projectService'

const RecentActivity = () => {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  // Fetch saved projects
  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      setError('')

      const data = await getProjects()

      setProjects(
        Array.isArray(data.projects) ? data.projects : []
      )
    } catch (err) {
      console.error('Recent projects error:', err)
      setError(err.message || 'Unable to load recent projects.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  // Format project date
  const formatDate = (date) => {
    if (!date) return 'Recently saved'

    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Delete project
  const handleDelete = async (project) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name || 'Untitled Project'}"? This action cannot be undone.`
    )

    if (!confirmed) return

    try {
      setDeletingId(project._id)
      setDeleteError('')

      await deleteProject(project._id)

      setProjects((previousProjects) =>
        previousProjects.filter(
          (item) => item._id !== project._id
        )
      )

      if (selectedProject?._id === project._id) {
        setSelectedProject(null)
      }

      // Notify other dashboard components
      window.dispatchEvent(
        new Event('pixclear:projects-updated')
      )

    } catch (err) {
      console.error('Delete project error:', err)
      setDeleteError(
        err.message || 'Unable to delete this project.'
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Recent Activity
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Your latest saved image projects.
          </p>
        </div>

        <span className="rounded-full bg-violet-50 px-3 py-1.5 text-[10px] font-semibold text-violet-600">
          {projects.length} Projects
        </span>
      </div>

      {/* Delete Error */}
      {deleteError && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600">
          <AlertCircle size={15} />
          {deleteError}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <RefreshCw
            size={25}
            className="animate-spin text-violet-500"
          />

          <p className="mt-3 text-xs text-gray-500">
            Loading your projects...
          </p>
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="py-10 text-center">
          <p className="text-sm text-red-500">{error}</p>

          <button
            onClick={fetchProjects}
            className="mt-4 text-xs font-semibold text-violet-600"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-500">
            <Clock3 size={25} />
          </div>

          <h3 className="mt-4 text-sm font-bold text-gray-800">
            No recent activity yet
          </h3>

          <p className="mt-2 max-w-xs text-xs leading-6 text-gray-500">
            Your saved image projects will appear here.
          </p>

          <Link
            to="/dashboard"
            className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-violet-600"
          >
            <ImagePlus size={15} />
            Start a new project
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Project Cards */}
      {!isLoading && !error && projects.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {projects.slice(0, 6).map((project) => (
            <article
              key={project._id}
              className="group overflow-hidden rounded-xl border border-gray-100 bg-gray-50 transition hover:border-violet-200 hover:shadow-md"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                {project.processedImage?.url ? (
                  <img
                    src={project.processedImage.url}
                    alt={project.name || 'Processed image'}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    <ImageIcon size={30} />
                  </div>
                )}

                <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                  Background Removed
                </span>

                {/* Image Preview Button */}
                <button
                  onClick={() => setSelectedProject(project)}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-800 opacity-0 shadow transition hover:bg-violet-600 hover:text-white group-hover:opacity-100"
                  aria-label="Preview project"
                >
                  <Eye size={16} />
                </button>
              </div>

              {/* Project Information */}
              <div className="p-4">
                <h3 className="truncate text-sm font-bold text-gray-800">
                  {project.name || 'Untitled Project'}
                </h3>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500">
                    {formatDate(project.createdAt)}
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="text-xs font-semibold text-violet-600 hover:text-violet-800"
                    >
                      Preview
                    </button>

                    <button
                      onClick={() => handleDelete(project)}
                      disabled={deletingId === project._id}
                      className="text-red-500 transition hover:text-red-700 disabled:opacity-40"
                      aria-label="Delete project"
                      title="Delete project"
                    >
                      {deletingId === project._id ? (
                        <RefreshCw
                          size={15}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}

        </div>
      )}

      {/* Preview Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  {selectedProject.name || 'Untitled Project'}
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  {formatDate(selectedProject.createdAt)}
                </p>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
                aria-label="Close preview"
              >
                <X size={18} />
              </button>
            </div>

            {/* Preview Image */}
            <div className="flex max-h-[65vh] items-center justify-center overflow-auto bg-gray-100 p-4">
              {selectedProject.processedImage?.url ? (
                <img
                  src={selectedProject.processedImage.url}
                  alt={selectedProject.name || 'Processed image'}
                  className="max-h-[60vh] max-w-full object-contain"
                />
              ) : (
                <p className="text-sm text-gray-500">
                  Image unavailable.
                </p>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <button
                onClick={() => handleDelete(selectedProject)}
                disabled={deletingId === selectedProject._id}
                className="inline-flex items-center gap-2 rounded-xl border border-red-100 px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 size={15} />
                Delete Project
              </button>

              <div className="flex gap-2">
                <a
                  href={selectedProject.processedImage?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  <ExternalLink size={15} />
                  Open Image
                </a>

                {selectedProject.processedImage?.url && (
                  <a
                    href={selectedProject.processedImage.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-violet-700"
                  >
                    <Download size={15} />
                    Download
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  )
}

export default RecentActivity
