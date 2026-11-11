
import DashboardLayout from '../../layouts/DashboardLayout'
import DashboardHeader from '../../components/dashboard/DashboardHeader'
import UsageStats from '../../components/dashboard/UsageStats'
import UploadPanel from '../../components/dashboard/UploadPanel'
import RecentActivity from '../../components/dashboard/RecentActivity'

const Dashboard = () => {
  return (
    <DashboardLayout>
      {({ onMenuClick }) => (
        <div className="min-h-screen bg-[#FAF9FC]">
          <DashboardHeader onMenuClick={onMenuClick} />

          <div className="mx-auto w-full max-w-[1500px] space-y-9 px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">

            {/* Dashboard overview */}
            <section>
              <UsageStats />
            </section>

            {/* Image workspace */}
            <section>
              <UploadPanel />
            </section>

            {/* Recent projects */}
            <section>
              <RecentActivity />
            </section>

            <footer className="border-t border-[#EDE9F2] pt-6 pb-3 text-center">
              <p className="text-xs font-medium text-[#A09AAA]">
                © {new Date().getFullYear()} Pixclear. All rights reserved.
              </p>
            </footer>

          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default Dashboard
