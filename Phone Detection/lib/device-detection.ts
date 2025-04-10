import { UAParser } from "ua-parser-js"
import type { DeviceData } from "./db"

export function detectDevice(userAgent: string, clientHints?: any): DeviceData {
  const parser = new UAParser(userAgent)
  const result = parser.getResult()

  const browser = result.browser
  const os = result.os
  const device = result.device

  // Default values for device data
  const deviceData: DeviceData = {
    isMobile:
      device.type === "mobile" ||
      device.type === "tablet" ||
      /mobile|android|iphone|ipad|ipod/i.test(userAgent.toLowerCase()),
    screenPixelsHeight: clientHints?.screenHeight || 0,
    screenPixelsWidth: clientHints?.screenWidth || 0,
    platformName: os.name || "Unknown",
    platformVersion: os.version || "Unknown",
    platformVendor: "Unknown",
    browserName: browser.name || "Unknown",
    browserVersion: browser.version || "Unknown",
    browserVendor: "Unknown",
    setHeaderBrowserAcceptCH: "Not Available",
    setHeaderHardwareAcceptCH: "Not Available",
    setHeaderPlatformAcceptCH: "Not Available",
    javascriptGetHighEntropyValues: "Not Available",
    javascriptHardwareProfile: "Not Available",
  }

  return deviceData
}
