import { cookies } from "next/headers"

// Simple authentication for the admin
const ADMIN_EMAIL = "fernando.tarnogol@invisible.email"
const ADMIN_PASSWORD = "GoogleInvisible!"

export function validateCredentials(email: string, password: string): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD
}

// Helper function to check authentication status
export async function checkAuth(): Promise<boolean> {
  const cookieStore = cookies()
  const session = cookieStore.get("admin-session")
  return session?.value === "authenticated"
}
