import type { UserData } from "@/lib/db"

interface DeviceDataTableProps {
  users: UserData[]
}

export function DeviceDataTable({ users }: DeviceDataTableProps) {
  if (!users || users.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-md">
        <p className="text-gray-500">No data available yet. Ask users to submit the form to collect device data.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Resolution
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Browser</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{user.deviceData.isMobile ? "Mobile" : "Desktop"}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {user.deviceData.screenPixelsWidth}x{user.deviceData.screenPixelsHeight}
                  {user.deviceData.devicePixelRatio && (
                    <span className="text-xs text-gray-400 ml-1">
                      (Pixel Ratio: {user.deviceData.devicePixelRatio})
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {user.deviceData.platformName} {user.deviceData.platformVersion}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {user.deviceData.browserName} {user.deviceData.browserVersion}
                </div>
              </td>
              <td className="px-6 py-4">
                <details className="text-sm text-gray-500">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800">View All Properties</summary>
                  <div className="mt-2 space-y-1 text-xs">
                    <p>
                      <strong>Platform Vendor:</strong> {user.deviceData.platformVendor}
                    </p>
                    <p>
                      <strong>Browser Vendor:</strong> {user.deviceData.browserVendor}
                    </p>
                    {user.deviceData.logicalScreenWidth && (
                      <p>
                        <strong>Logical Resolution:</strong> {user.deviceData.logicalScreenWidth}x
                        {user.deviceData.logicalScreenHeight}
                      </p>
                    )}
                    <p>
                      <strong>Accept-CH Headers:</strong> {user.deviceData.setHeaderBrowserAcceptCH},{" "}
                      {user.deviceData.setHeaderHardwareAcceptCH}, {user.deviceData.setHeaderPlatformAcceptCH}
                    </p>
                    {user.deviceData.javascriptGetHighEntropyValues !== "Not Available" && (
                      <p>
                        <strong>High Entropy Values:</strong> {user.deviceData.javascriptGetHighEntropyValues}
                      </p>
                    )}
                    {user.deviceData.javascriptHardwareProfile !== "Not Available" && (
                      <p>
                        <strong>Hardware Profile:</strong> {user.deviceData.javascriptHardwareProfile}
                      </p>
                    )}
                  </div>
                </details>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
