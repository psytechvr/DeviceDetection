"use server"

import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { validateCredentials, checkAuth } from "@/lib/auth"
import { addUser } from "@/lib/db"
import { detectDevice } from "@/lib/device-detection"
import type { DeviceData } from "@/lib/db"

export async function submitUserData(formData: FormData) {
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const consent = formData.get("consent") as string

  // Validate inputs
  if (!firstName || !lastName || !email || !consent) {
    return { success: false, message: "All fields are required, including consent" }
  }

  // Get user agent and client hints
  const userAgent = headers().get("user-agent") || ""
  const clientHints = {
    screenWidth: Number.parseInt(formData.get("screenWidth") as string) || 0,
    screenHeight: Number.parseInt(formData.get("screenHeight") as string) || 0,
  }

  // Detect device
  const deviceData = detectDevice(userAgent, clientHints)

  // Additional device data from client-side JavaScript
  const jsDeviceData = JSON.parse((formData.get("deviceData") as string) || "{}")

  // Merge device data
  const mergedDeviceData: DeviceData = {
    ...deviceData,
    ...jsDeviceData,
  }

  // Add user to database
  try {
    addUser({
      firstName,
      lastName,
      email,
      deviceData: mergedDeviceData,
    })

    return { success: true, message: "Thank you for your submission!" }
  } catch (error) {
    console.error("Error saving user data:", error)
    return { success: false, message: "An error occurred. Please try again." }
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (validateCredentials(email, password)) {
    // Set a session cookie
    cookies().set("admin-session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    redirect("/admin/dashboard")
  }

  return { success: false, message: "Invalid credentials" }
}

export async function logout() {
  cookies().delete("admin-session")
  redirect("/admin/login")
}

// Check if user is authenticated - using the new checkAuth function
export async function isAuthenticated() {
  return checkAuth()
}
