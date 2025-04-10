import { redirect } from "next/navigation"
import Image from "next/image"
import { isAuthenticated, logout } from "@/app/actions"
import { getAllUsers } from "@/lib/db"
import { DeviceDataTable } from "@/components/device-data-table"

export default async function DashboardPage() {
  try {
    // Check if user is authenticated
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      redirect("/admin/login")
    }

    // Get all users
    const users = getAllUsers()

    return (
      <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 flex justify-between items-center border-b">
            <div className="flex items-center">
              <div className="w-8 h-8 mr-2">
                <Image src="/invisible-logo.svg" alt="Invisible Logo" width={32} height={32} />
              </div>
              <span className="text-gray-700 font-semibold">INVISIBLE</span>
            </div>
            <form action={logout}>
              <button type="submit" className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">
                Logout
              </button>
            </form>
          </div>

          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Device Data</h1>

            <DeviceDataTable users={users} />

            <div className="mt-6 flex justify-center">
              <a
                href="/api/export-csv"
                className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800 transition-colors"
                download="device-data.csv"
              >
                Export CSV
              </a>
            </div>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    console.error("Dashboard error:", error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p>An error occurred while loading the dashboard. Please try again later.</p>
          <div className="mt-4">
            <a href="/admin/login" className="text-blue-600 hover:underline">
              Return to login
            </a>
          </div>
        </div>
      </div>
    )
  }
}
