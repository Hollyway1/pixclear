
import { useEffect, useState, useCallback } from 'react'
import {
  Image,
  Zap,
  FolderOpen,
  ArrowUpRight,
  RefreshCw,
  CalendarDays,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'

import {
  getUsage,
  getProjects,
} from '../../services/projectService'

const UsageStats = () => {
  const [usage, setUsage] = useState({
    used: 0,
    limit: 20,
    remaining: 20,
  })

  const [totalProjects, setTotalProjects] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchStatistics = useCallback(async () => {
    try {
      setIsLoading(true)
      setError('')

      const [usageData, projectsData] = await Promise.all([
        getUsage(),
        getProjects(),
      ])

      setUsage({
        used: usageData.used ?? 0,
        limit: usageData.limit ?? 20,
        remaining: usageData.remaining ?? 20,
      })

      setTotalProjects(
        projectsData.count ??
        projectsData.projects?.length ??
        0
      )
    } catch (err) {
      console.error('Dashboard statistics error:', err)
      setError(err.message || 'Unable to load statistics.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStatistics()

    window.addEventListener(
      'pixclear:projects-updated',
      fetchStatistics
    )

    return () => {
      window.removeEventListener(
        'pixclear:projects-updated',
        fetchStatistics
      )
    }
  }, [fetchStatistics])

  const progress =
    usage.limit > 0
      ? Math.min((usage.used / usage.limit) * 100, 100)
      : 0

  const usagePercentage = Math.round(progress)

  const isLimitReached =
    usage.limit === 0 || usage.remaining <= 0

  const isNearLimit =
    !isLimitReached && usagePercentage >= 80

  const nextResetDate = new Date()
  nextResetDate.setMonth(nextResetDate.getMonth() + 1, 1)
  nextResetDate.setHours(0, 0, 0, 0)

  const formattedResetDate = nextResetDate.toLocaleDateString(
    'en-NG',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  )

  const statistics = [
    {
      label: 'Projects This Month',
      value: usage.used,
      description: 'Projects saved this month',
      icon: Image,
      iconStyle: 'bg-violet-100 text-violet-700',
      accent: 'from-violet-500 to-purple-600',
      numberStyle: 'text-[#26143D]',
    },
    {
      label: 'Remaining Projects',
      value: usage.remaining,
      description: `${usage.limit} projects allowed monthly`,
      icon: Zap,
      iconStyle: 'bg-amber-100 text-amber-700',
      accent: 'from-amber-400 to-orange-500',
      numberStyle: 'text-[#26143D]',
    },
    {
      label: 'Saved Projects',
      value: totalProjects,
      description: 'Your total saved projects',
      icon: FolderOpen,
      iconStyle: 'bg-fuchsia-100 text-fuchsia-700',
      accent: 'from-fuchsia-500 to-pink-500',
      numberStyle: 'text-[#26143D]',
    },
  ]

  const status = isLimitReached
    ? {
        title: 'Monthly allowance reached',
        description: 'You have used your entire monthly saved-project allowance.',
        icon: AlertCircle,
        wrapper: 'border-red-100 bg-red-50/80',
        iconStyle: 'text-red-600 bg-red-100',
        titleStyle: 'text-red-800',
        descriptionStyle: 'text-red-700',
      }
    : isNearLimit
      ? {
          title: "You're running low on projects",
          description: `You have ${usage.remaining} project${usage.remaining === 1 ? '' : 's'} remaining this month.`,
          icon: AlertCircle,
          wrapper: 'border-amber-100 bg-amber-50/80',
          iconStyle: 'text-amber-700 bg-amber-100',
          titleStyle: 'text-amber-800',
          descriptionStyle: 'text-amber-700',
        }
      : {
          title: "You're doing great!",
          description: `You have ${usage.remaining} project${usage.remaining === 1 ? '' : 's'} available for this month.`,
          icon: CheckCircle2,
          wrapper: 'border-violet-100 bg-violet-50/70',
          iconStyle: 'text-violet-700 bg-violet-100',
          titleStyle: 'text-violet-900',
          descriptionStyle: 'text-violet-700',
        }

  return (
    <section className="space-y-5">

      {/* Section heading */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-5 rounded-full bg-violet-600" />
            <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-600">
              Workspace overview
            </span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight text-[#211432] sm:text-2xl">
            Your Overview
          </h2>

          <p className="mt-1 text-sm text-[#91889D]">
            Track your Pixclear activity and monthly usage.
          </p>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-2 sm:flex">
          <Sparkles size={14} className="text-violet-600" />
          <span className="text-[11px] font-semibold text-[#746982]">
            Your creative workspace
          </span>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle size={17} className="shrink-0 text-red-500" />
            <p className="text-xs font-medium text-red-700">
              {error}
            </p>
          </div>

          <button
            onClick={fetchStatistics}
            disabled={isLoading}
            className="text-xs font-bold text-red-600 transition hover:text-red-800 disabled:opacity-50"
          >
            Retry
          </button>
        </div>
      )}

      {/* Statistics cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statistics.map((stat) => {
          const Icon = stat.icon

          return (
            <article
              key={stat.label}
              className="group relative overflow-hidden rounded-[22px] border border-[#EDE8F3] bg-white p-5 shadow-[0_4px_20px_rgba(37,20,57,0.025)] transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_12px_35px_rgba(79,42,120,0.09)]"
            >
              {/* Top accent */}
              <div className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${stat.accent}`} />

              <div className="flex items-center justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.iconStyle} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon size={20} />
                </div>

                <ArrowUpRight
                  size={18}
                  className="text-[#C5BDCF] transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-violet-600"
                />
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold text-[#91889D]">
                  {stat.label}
                </p>

                <div className="mt-1.5 flex items-baseline gap-2">
                  {isLoading ? (
                    <span className="inline-block h-9 w-14 animate-pulse rounded-lg bg-[#F0ECF5]" />
                  ) : (
                    <p className={`text-3xl font-black tracking-tight ${stat.numberStyle}`}>
                      {stat.value.toLocaleString()}
                    </p>
                  )}
                </div>

                <p className="mt-2 text-[11px] font-medium text-[#AAA2B3]">
                  {stat.description}
                </p>
              </div>
            </article>
          )
        })}
      </div>

      {/* Monthly usage */}
      <div className="relative overflow-hidden rounded-[24px] border border-[#EDE8F3] bg-white p-5 shadow-[0_4px_20px_rgba(37,20,57,0.025)] sm:p-6">

        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-violet-100/50 blur-3xl" />

        <div className="relative">

          {/* Usage heading */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <Zap size={17} />
                </div>

                <h3 className="text-base font-extrabold text-[#261638]">
                  Monthly Usage
                </h3>
              </div>

              <p className="mt-2 text-xs text-[#958B9F]">
                Monitor your monthly saved-project allowance.
              </p>
            </div>

            <div className="rounded-xl border border-violet-100 bg-violet-50 px-3 py-2">
              <p className="text-xs font-extrabold tabular-nums text-violet-700">
                {isLoading
                  ? 'Loading...'
                  : `${usage.used} / ${usage.limit}`}
              </p>
              <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-violet-500">
                Projects used
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-7">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#746982]">
                Usage progress
              </span>

              <span className="text-xs font-extrabold tabular-nums text-[#261638]">
                {isLoading ? '—' : `${usagePercentage}%`}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-[#F0EDF4]">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  isLimitReached
                    ? 'bg-gradient-to-r from-red-500 to-rose-400'
                    : isNearLimit
                      ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                      : 'bg-gradient-to-r from-violet-700 via-violet-600 to-fuchsia-500'
                }`}
                style={{
                  width: `${isLoading ? 0 : progress}%`,
                }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-[11px] text-[#A49BAB]">
                {isLoading
                  ? 'Calculating usage...'
                  : `${usage.remaining} projects remaining`}
              </p>

              <button
                onClick={fetchStatistics}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-bold text-violet-600 transition hover:bg-violet-50 hover:text-violet-800 disabled:opacity-50"
              >
                <RefreshCw
                  size={12}
                  className={isLoading ? 'animate-spin' : ''}
                />
                Refresh
              </button>
            </div>
          </div>

          {/* Usage status */}
          {!isLoading && !error && (
            <div className={`mt-6 flex items-start gap-3 rounded-2xl border p-4 ${status.wrapper}`}>
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${status.iconStyle}`}>
                <status.icon size={18} />
              </div>

              <div>
                <p className={`text-xs font-extrabold ${status.titleStyle}`}>
                  {status.title}
                </p>

                <p className={`mt-1 text-[11px] leading-5 ${status.descriptionStyle}`}>
                  {status.description}

                  {isLimitReached && (
                    <> Your allowance resets on {formattedResetDate}.</>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Reset date */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#F0ECF4] pt-4">
            <div className="flex items-center gap-2 text-[11px] text-[#958B9F]">
              <CalendarDays size={15} className="text-violet-500" />
              <span>Next monthly reset</span>
            </div>

            <span className="text-[11px] font-bold text-[#5C4C6D]">
              {formattedResetDate}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UsageStats
