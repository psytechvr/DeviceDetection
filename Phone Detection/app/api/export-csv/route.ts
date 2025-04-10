import { type NextRequest, NextResponse } from "next/server"
import { getAllUsers, usersToCSV } from "@/lib/db"
import { checkAuth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const authenticated = await checkAuth()
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all users
    const users = getAllUsers()

    // Handle empty users case
    if (users.length === 0) {
      return NextResponse.json({ message: "No data available" }, { status: 404 })
    }

    // Convert to CSV with proper formatting
    const csv = usersToCSV(users)

    // Add BOM for Excel compatibility
    const csvWithBOM = "\uFEFF" + csv

    // Return CSV file with proper headers
    return new NextResponse(csvWithBOM, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="Device Data Collection.csv"',
      },
    })
  } catch (error) {
    console.error("CSV export error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
