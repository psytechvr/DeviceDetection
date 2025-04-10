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

// Camera information interface
export interface CameraInfo {
  deviceId: string
  label: string
  facingMode: 'front' | 'back' | 'unknown'
  currentResolution: {
    width: number
    height: number
  }
  supportedResolutions: Array<{
    width: number
    height: number
  }>
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
  cameras?: CameraInfo[] // Optional array of camera information
}

const USERS_COOKIE_KEY = "invisible-users-data"

// Get all users
export function getAllUsers(): UserData[] {
  try {
    const cookieStore = cookies()
    const usersCookie = cookieStore.get(USERS_COOKIE_KEY)

    if (usersCookie && usersCookie.value) {
      const users = JSON.parse(usersCookie.value)
      
      // Ensure camera data is properly parsed for each user
      return users.map((user: UserData) => {
        // Make sure deviceData exists
        if (!user.deviceData) {
          user.deviceData = {} as DeviceData
        }
        
        // Ensure cameras property exists and is properly formatted
        if (!user.deviceData.cameras) {
          user.deviceData.cameras = []
        } else if (typeof user.deviceData.cameras === 'string') {
          // Handle case where cameras might be stored as a string
          try {
            user.deviceData.cameras = JSON.parse(user.deviceData.cameras as any)
          } catch (e) {
            console.error("Error parsing camera data:", e)
            user.deviceData.cameras = []
          }
        }
        
        return user
      })
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

    // Ensure deviceData exists
    if (!userData.deviceData) {
      userData.deviceData = {} as DeviceData
    }
    
    // Ensure cameras property exists and is properly formatted
    if (!userData.deviceData.cameras) {
      userData.deviceData.cameras = []
    } else if (typeof userData.deviceData.cameras === 'string') {
      // Handle case where cameras might be stored as a string
      try {
        userData.deviceData.cameras = JSON.parse(userData.deviceData.cameras as any)
      } catch (e) {
        console.error("Error parsing camera data:", e)
        userData.deviceData.cameras = []
      }
    }

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
    "CameraCount",
    "Camera1_Label",
    "Camera1_FacingMode",
    "Camera1_Resolution",
    "Camera2_Label",
    "Camera2_FacingMode",
    "Camera2_Resolution"
  ]

  // Format the header row
  const headerRow = headers.map((h) => `"${h}"`).join(",")

  // Create data rows
  const dataRows = users.map((user) => {
    // Format camera information
    const cameraCount = user.deviceData.cameras ? user.deviceData.cameras.length : 0;
    
    // Get camera details for up to 2 cameras (main and front-facing)
    const camera1 = user.deviceData.cameras?.[0] || null;
    const camera2 = user.deviceData.cameras?.[1] || null;

    const formatCameraInfo = (camera: CameraInfo | null) => {
      if (!camera) return ["", "", ""];
      return [
        camera.label,
        camera.facingMode,
        `${camera.currentResolution.width}x${camera.currentResolution.height}`
      ];
    };

    const [camera1Label, camera1Facing, camera1Res] = formatCameraInfo(camera1);
    const [camera2Label, camera2Facing, camera2Res] = formatCameraInfo(camera2);

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
      cameraCount,
      camera1Label,
      camera1Facing,
      camera1Res,
      camera2Label,
      camera2Facing,
      camera2Res
    ]

    return values.map(formatCSVValue).join(",")
  })

  // Combine header and data rows with Windows-style line endings
  return [headerRow, ...dataRows].join("\r\n")
}
