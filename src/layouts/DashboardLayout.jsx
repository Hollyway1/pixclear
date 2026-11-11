
import { useState } from 'react'
import DashboardSidebar from '../components/dashboard/DashboardSidebar'

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#FAFAFC] lg:flex">

      <DashboardSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="min-w-0 flex-1">
        {typeof children === 'function'
          ? children({ onMenuClick: () => setSidebarOpen(true) })
          : children}
      </main>

    </div>
  )
}

export default DashboardLayout
