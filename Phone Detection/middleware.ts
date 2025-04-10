import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  try {
    // Get the pathname of the request
    const path = request.nextUrl.pathname

    // Check if the path starts with /admin and is not the login page
    if (path.startsWith("/admin") && path !== "/admin/login") {
      // Check if the user is authenticated
      const session = request.cookies.get("admin-session")

      if (!session || session.value !== "authenticated") {
        // Redirect to login page if not authenticated
        return NextResponse.redirect(new URL("/admin/login", request.url))
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    // In case of an error, redirect to login
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }
}

export const config = {
  matcher: ["/admin/:path*"],
}
