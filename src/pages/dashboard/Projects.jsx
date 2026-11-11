
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Search,
  FolderOpen,
  Image as ImageIcon,
  Download,
  Trash2,
  Eye,
  X,
  RefreshCw,
  AlertCircle,
  CalendarDays,
  ArrowUpRight,
} from 'lucide-react'

import DashboardLayout from '../../layouts/DashboardLayout'
import DashboardHeader from '../../components/dashboard/DashboardHeader'
import {
  getProjects,
  deleteProject,
} from '../../services/projectService'

const formatDate = (date) => {
  if (!date) return 'Date unavailable'

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Date unavailable'
  }

  return parsedDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)

  // Fetch saved projects
  const fetchProjects = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      setError('')

      const data = await getProjects()

      setProjects(
        Array.isArray(data?.projects) ? data.projects : []
      )
    } catch (err) {
      console.error('Failed to fetch projects:', err)
      setError(err.message || 'Unable to load your projects.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()

    const handleProjectsUpdated = () => {
      fetchProjects(true)
    }

    window.addEventListener(
      'pixclear:projects-updated',
      handleProjectsUpdated
    )

    return () => {
      window.removeEventListener(
        'pixclear:projects-updated',
        handleProjectsUpdated
      )
    }
  }, [fetchProjects])

  // Search projects
  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) return projects

    return projects.filter((project) =>
      (project.name || 'Untitled Project')
        .toLowerCase()
        .includes(query)
    )
  }, [projects, search])

  // Delete project
  const handleDelete = async (project) => {
    const projectName = project.name || 'Untitled Project'

    const confirmed = window.confirm(
      `Are you sure you want to delete "${projectName}"? This action cannot be undone.`
    )

    if (!confirmed) return

    try {
      setDeletingId(project._id)

      await deleteProject(project._id)

      setProjects((current) =>
        current.filter((item) => item._id !== project._id)
      )

      if (selectedProject?._id === project._id) {
        setSelectedProject(null)
      }

      window.dispatchEvent(
        new Event('pixclear:projects-updated')
      )
    } catch (err) {
      console.error('Failed to delete project:', err)
      setError(err.message || 'Unable to delete this project.')
    } finally {
      setDeletingId(null)
    }
  }

  // Download processed image
  const handleDownload = (project) => {
    const imageUrl =
      project.processedImage?.url ||
      project.originalImage?.url

    if (!imageUrl) {
      setError('No downloadable image was found for this project.')
      return
    }

    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `${project.name || 'pixclear-image'}.png`
    link.target = '_blank'
    link.rel = 'noopener noreferrer'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <DashboardLayout>
      {({ onMenuClick }) => (
        <div className="min-h-screen bg-[#FAF9FC]">
          <DashboardHeader onMenuClick={onMenuClick} />

          <main className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

            {/* Page heading */}
            <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#8060D8]">
                  <FolderOpen size={16} />
                  <span>Your workspace</span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-[#201A2C] sm:text-3xl">
                  My Projects
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[#898294]">
                  View, manage and download all your saved image
                  projects in one place.
                </p>
              </div>

              <button
                onClick={() => fetchProjects(true)}
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[#EAE5F1] bg-white px-4 py-3 text-sm font-semibold text-[#514A60] shadow-sm transition hover:border-[#CFC1F0] hover:text-[#8060D8] disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? 'animate-spin' : ''}
                />
                Refresh Projects
              </button>
            </div>

            {/* Project summary */}
            <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#EEE9F4] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#958DA0]">
                      Total Projects
                    </p>

                    <p className="mt-2 text-3xl font-bold text-[#251E32]">
                      {loading ? '—' : projects.length}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0EBFF] text-[#8060D8]">
                    <FolderOpen size={22} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#EEE9F4] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#958DA0]">
                      Search Results
                    </p>

                    <p className="mt-2 text-3xl font-bold text-[#251E32]">
                      {loading ? '—' : filteredProjects.length}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF5FF] text-[#3994D8]">
                    <Search size={22} />
                  </div>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A49BAF]"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search your projects..."
                  className="w-full rounded-xl border border-[#EAE5F1] bg-white py-3.5 pl-11 pr-4 text-sm text-[#30283C] outline-none transition placeholder:text-[#B1A9BB] focus:border-[#A58BE8] focus:ring-4 focus:ring-[#8060D8]/10"
                />
              </div>

              <p className="text-sm text-[#9A92A4]">
                {loading
                  ? 'Loading projects...'
                  : `Showing ${filteredProjects.length} of ${projects.length} projects`}
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle size={19} className="mt-0.5 shrink-0" />

                <div className="flex-1">
                  <p>{error}</p>
                </div>

                <button
                  onClick={() => setError('')}
                  className="rounded-lg p-1 transition hover:bg-red-100"
                  aria-label="Dismiss error"
                >
                  <X size={17} />
                </button>
              </div>
            )}

            {/* Loading state */}
            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-2xl border border-[#EEE9F4] bg-white"
                  >
                    <div className="aspect-[16/10] animate-pulse bg-[#F0EDF4]" />

                    <div className="space-y-3 p-5">
                      <div className="h-4 w-2/3 animate-pulse rounded bg-[#F0EDF4]" />
                      <div className="h-3 w-1/3 animate-pulse rounded bg-[#F0EDF4]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProjects.length > 0 ? (

              /* Projects grid */
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProjects.map((project) => {
                  const imageUrl =
                    project.processedImage?.url ||
                    project.originalImage?.url

                  return (
                    <article
                      key={project._id}
                      className="group overflow-hidden rounded-2xl border border-[#EEE9F4] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#D8CDF0] hover:shadow-lg"
                    >
                      {/* Image preview */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-[#F2EFF6]">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={project.name || 'Saved project'}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[#A79DB4]">
                            <ImageIcon size={42} />
                          </div>
                        )}

                        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-[#171020]/0 opacity-0 transition duration-300 group-hover:bg-[#171020]/35 group-hover:opacity-100">
                          <button
                            onClick={() => setSelectedProject(project)}
                            disabled={!imageUrl}
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#6E51C6] shadow-lg transition hover:scale-110 disabled:cursor-not-allowed"
                            title="Preview project"
                            aria-label="Preview project"
                          >
                            <Eye size={19} />
                          </button>

                          <button
                            onClick={() => handleDownload(project)}
                            disabled={!imageUrl}
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#6E51C6] shadow-lg transition hover:scale-110 disabled:cursor-not-allowed"
                            title="Download image"
                            aria-label="Download image"
                          >
                            <Download size={19} />
                          </button>
                        </div>

                        <div className="absolute left-3 top-3 rounded-lg border border-white/30 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-[#6E51C6] shadow-sm backdrop-blur">
                          PROCESSED
                        </div>
                      </div>

                      {/* Project details */}
                      <div className="p-5">
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3
                              className="truncate text-base font-bold text-[#282132]"
                              title={project.name || 'Untitled Project'}
                            >
                              {project.name || 'Untitled Project'}
                            </h3>

                            <div className="mt-2 flex items-center gap-2 text-xs text-[#9B93A5]">
                              <CalendarDays size={14} />
                              <span>{formatDate(project.createdAt)}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDelete(project)}
                            disabled={deletingId === project._id}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#A69EAF] transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                            title="Delete project"
                            aria-label="Delete project"
                          >
                            {deletingId === project._id ? (
                              <RefreshCw size={17} className="animate-spin" />
                            ) : (
                              <Trash2 size={17} />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center justify-between border-t border-[#F0EDF3] pt-4">
                          <span className="text-xs font-medium text-[#A19AAA]">
                            Background removed
                          </span>

                          <button
                            onClick={() => setSelectedProject(project)}
                            disabled={!imageUrl}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8060D8] transition hover:text-[#5F40B8] disabled:opacity-50"
                          >
                            View project
                            <ArrowUpRight size={14} />
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (

              /* Empty state */
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#DED6E9] bg-white px-6 py-12 text-center">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#F1ECFF] text-[#8060D8]">
                  {search ? (
                    <Search size={32} />
                  ) : (
                    <FolderOpen size={34} />
                  )}
                </div>

                <h3 className="text-lg font-bold text-[#292233]">
                  {search
                    ? 'No matching projects'
                    : 'No projects yet'}
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-[#968EA0]">
                  {search
                    ? 'Try another search term to find the project you are looking for.'
                    : 'Your saved image projects will appear here after you process and save your first image.'}
                </p>

                {search ? (
                  <button
                    onClick={() => setSearch('')}
                    className="mt-6 rounded-xl bg-[#8060D8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6D50C2]"
                  >
                    Clear Search
                  </button>
                ) : (
                  <a
                    href="/dashboard"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#8060D8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6D50C2]"
                  >
                    Go to Dashboard
                    <ArrowUpRight size={16} />
                  </a>
                )}
              </div>
            )}

            {/* Footer */}
            <footer className="mt-12 border-t border-[#EDE9F2] py-6 text-center">
              <p className="text-xs font-medium text-[#A09AAA]">
                © {new Date().getFullYear()} Pixclear. All rights reserved.
              </p>
            </footer>
          </main>

          {/* Project preview modal */}
          {selectedProject && (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-[#100B18]/80 p-4 backdrop-blur-sm"
              onClick={() => setSelectedProject(null)}
            >
              <div
                className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-[#EEE9F4] px-5 py-4 sm:px-6">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-[#292233]">
                      {selectedProject.name || 'Untitled Project'}
                    </h3>

                    <p className="mt-1 text-xs text-[#9A92A4]">
                      {formatDate(selectedProject.createdAt)}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedProject(null)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4F1F7] text-[#6F667C] transition hover:bg-[#EAE4F3]"
                    aria-label="Close preview"
                  >
                    <X size={19} />
                  </button>
                </div>

                <div className="flex max-h-[70vh] items-center justify-center overflow-auto bg-[#F4F2F7] p-4 sm:p-8">
                  <img
                    src={
                      selectedProject.processedImage?.url ||
                      selectedProject.originalImage?.url
                    }
                    alt={selectedProject.name || 'Project preview'}
                    className="max-h-[60vh] max-w-full rounded-lg object-contain"
                  />
                </div>

                <div className="flex flex-col justify-between gap-3 border-t border-[#EEE9F4] px-5 py-4 sm:flex-row sm:items-center sm:px-6">
                  <p className="text-xs text-[#9A92A4]">
                    Your processed image is ready to download.
                  </p>

                  <button
                    onClick={() => handleDownload(selectedProject)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8060D8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6D50C2]"
                  >
                    <Download size={16} />
                    Download Image
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}

export default Projects
