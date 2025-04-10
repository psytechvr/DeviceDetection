"use client"

import { useState, useEffect } from "react"
import { submitUserData } from "@/app/actions"

export function RegistrationForm() {
  const [formState, setFormState] = useState({
    success: false,
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deviceData, setDeviceData] = useState({})

  // Collect device data on component mount
  useEffect(() => {
    const collectDeviceData = async () => {
      // Get accurate screen resolution
      const pixelRatio = window.devicePixelRatio || 1
      const logicalWidth = window.screen.width
      const logicalHeight = window.screen.height

      // Calculate physical resolution (actual pixels)
      const physicalWidth = Math.round(logicalWidth * pixelRatio)
      const physicalHeight = Math.round(logicalHeight * pixelRatio)

      // Basic device data
      const data: any = {
        isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
        screenPixelsHeight: physicalHeight, // Use physical height
        screenPixelsWidth: physicalWidth, // Use physical width
        devicePixelRatio: pixelRatio, // Store pixel ratio for reference
        logicalScreenWidth: logicalWidth, // Store logical width for reference
        logicalScreenHeight: logicalHeight, // Store logical height for reference
        platformName: navigator.platform || "Unknown",
        browserName: navigator.appName || "Unknown",
        browserVersion: navigator.appVersion || "Unknown",
        browserVendor: navigator.vendor || "Unknown",
        platformVendor: "Unknown",
        platformVersion: "Unknown",
        setHeaderBrowserAcceptCH: "Not Available",
        setHeaderHardwareAcceptCH: "Not Available",
        setHeaderPlatformAcceptCH: "Not Available",
        javascriptGetHighEntropyValues: "Not Available",
        javascriptHardwareProfile: "Not Available",
      }

      // Try to get high entropy values if available
      if (navigator.userAgentData) {
        try {
          const highEntropyValues = await navigator.userAgentData.getHighEntropyValues([
            "platform",
            "platformVersion",
            "architecture",
            "model",
            "uaFullVersion",
          ])

          data.javascriptGetHighEntropyValues = JSON.stringify(highEntropyValues)
          data.platformVendor = highEntropyValues.platform || "Unknown"
          data.platformVersion = highEntropyValues.platformVersion || "Unknown"
        } catch (e) {
          console.error("Error getting high entropy values:", e)
          data.javascriptGetHighEntropyValues = "Error: " + e.message
        }
      }

      // Check for hardware profile
      if ("hardwareConcurrency" in navigator) {
        data.javascriptHardwareProfile = JSON.stringify({
          cores: navigator.hardwareConcurrency,
          memory: navigator.deviceMemory || "Unknown",
          devicePixelRatio: pixelRatio,
          screenResolution: `${physicalWidth}x${physicalHeight} (physical), ${logicalWidth}x${logicalHeight} (logical)`,
        })
      }

      // Check for Accept-CH headers
      data.setHeaderBrowserAcceptCH = document.querySelector('meta[http-equiv="Accept-CH"][content*="Sec-CH-UA"]')
        ? "Supported"
        : "Not Supported"
      data.setHeaderHardwareAcceptCH = document.querySelector('meta[http-equiv="Accept-CH"][content*="Device-Memory"]')
        ? "Supported"
        : "Not Supported"
      data.setHeaderPlatformAcceptCH = document.querySelector(
        'meta[http-equiv="Accept-CH"][content*="Sec-CH-Platform"]',
      )
        ? "Supported"
        : "Not Supported"

      setDeviceData(data)
    }

    collectDeviceData()
  }, [])

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true)

      // Add device data to form
      formData.append("deviceData", JSON.stringify(deviceData))

      // Add screen resolution data
      const pixelRatio = window.devicePixelRatio || 1
      const physicalWidth = Math.round(window.screen.width * pixelRatio)
      const physicalHeight = Math.round(window.screen.height * pixelRatio)

      formData.append("screenWidth", physicalWidth.toString())
      formData.append("screenHeight", physicalHeight.toString())

      const result = await submitUserData(formData)
      setFormState(result)
    } catch (error) {
      console.error("Form submission error:", error)
      setFormState({
        success: false,
        message: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (formState.success) {
    return (
      <div className="text-center p-6">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h2>
        <p className="mb-4">{formState.message}</p>
        <p>Your information has been successfully submitted.</p>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="John"
        />
      </div>

      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
          Last Name
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Doe"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Invisible e-mail
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="john.doe@invisible.email"
        />
      </div>

      <div className="bg-gray-100 p-3 rounded-md text-sm text-gray-700">
        By submitting your name, last name, and email address you allow Invisible Technologies to collect your mobile
        device's information
      </div>

      <div className="flex items-start">
        <input type="checkbox" id="consent" name="consent" value="yes" required className="mt-1 mr-2" />
        <label htmlFor="consent" className="text-sm text-gray-700">
          I give my consent
        </label>
      </div>

      {formState.message && !formState.success && <div className="text-red-600 text-sm">{formState.message}</div>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-purple-700 text-white py-2 rounded-md hover:bg-purple-800 transition-colors disabled:bg-purple-400"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  )
}
