import { cookies } from "next/headers"

// Define types for our data
export interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
  timestamp: string
  deviceData: DeviceData
}

export interface DeviceData {
  isMobile: boolean
  screenPixelsHeight: number
  screenPixelsWidth: number
  platformName: string
  platformVersion: string
  platformVendor: string
  browserName: string
  browserVersion: string
  browserVendor: string
  setHeaderBrowserAcceptCH: string
  setHeaderHardwareAcceptCH: string
  setHeaderPlatformAcceptCH: string
  javascriptGetHighEntropyValues: string
  javascriptHardwareProfile: string
}

const USERS_COOKIE_KEY = "invisible-users-data"

// Get all users
export function getAllUsers(): UserData[] {
  try {
    const cookieStore = cookies()
    const usersCookie = cookieStore.get(USERS_COOKIE_KEY)

    if (usersCookie && usersCookie.value) {
      return JSON.parse(usersCookie.value)
    }

    return []
  } catch (error) {
    console.error("Error getting users:", error)
    return []
  }
}

// Add a new user
export function addUser(userData: Omit<UserData, "id" | "timestamp">): UserData {
  try {
    const users = getAllUsers()

    const newUser: UserData = {
      ...userData,
      id: Math.random().toString(36).substring(2, 15),
      timestamp: new Date().toISOString(),
    }

    users.push(newUser)

    // Save to cookie
    const cookieStore = cookies()
    cookieStore.set(USERS_COOKIE_KEY, JSON.stringify(users), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    return newUser
  } catch (error) {
    console.error("Error adding user:", error)
    throw error
  }
}

// Helper function to format CSV value
function formatCSVValue(value: any): string {
  if (value === null || value === undefined) {
    return '""'
  }

  // Convert booleans to strings
  if (typeof value === "boolean") {
    return value ? '"true"' : '"false"'
  }

  // Handle objects and arrays (like JSON strings)
  if (typeof value === "object") {
    try {
      value = JSON.stringify(value)
    } catch (e) {
      value = String(value)
    }
  }

  const stringValue = String(value)

  // Always quote the value and escape any quotes inside
  return `"${stringValue.replace(/"/g, '""')}"`
}

// Convert users to CSV with the exact format expected
export function usersToCSV(users: UserData[]): string {
  if (users.length === 0) {
    return ""
  }

  // Define the exact headers in the expected order
  const headers = [
    "First Name",
    "Last Name",
    "Email",
    "IsMobile",
    "ScreenPixelsHeight",
    "ScreenPixelsWidth",
    "PlatformName",
    "PlatformVersion",
    "PlatformVendor",
    "BrowserName",
    "BrowserVersion",
    "BrowserVendor",
    "SetHeaderBrowserAccept-CH",
    "SetHeaderHardwareAccept-CH",
    "SetHeaderPlatformAccept-CH",
    "JavascriptGetHighEntropyValues",
    "JavascriptHardwareProfile",
  ]

  // Format the header row
  const headerRow = headers.map((h) => `"${h}"`).join(",")

  // Create data rows
  const dataRows = users.map((user) => {
    const values = [
      user.firstName,
      user.lastName,
      user.email,
      user.deviceData.isMobile,
      user.deviceData.screenPixelsHeight,
      user.deviceData.screenPixelsWidth,
      user.deviceData.platformName,
      user.deviceData.platformVersion,
      user.deviceData.platformVendor,
      user.deviceData.browserName,
      user.deviceData.browserVersion,
      user.deviceData.browserVendor,
      user.deviceData.setHeaderBrowserAcceptCH,
      user.deviceData.setHeaderHardwareAcceptCH,
      user.deviceData.setHeaderPlatformAcceptCH,
      user.deviceData.javascriptGetHighEntropyValues,
      user.deviceData.javascriptHardwareProfile,
    ]

    return values.map(formatCSVValue).join(",")
  })

  // Combine header and data rows
  return [headerRow, ...dataRows].join("\r\n")
}
