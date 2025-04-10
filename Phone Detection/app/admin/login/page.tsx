import Image from "next/image"
import Link from "next/link"
import { LoginForm } from "@/components/login-form"
import { redirect } from "next/navigation"
import { isAuthenticated } from "@/app/actions"

export default async function LoginPage() {
  // If already authenticated, redirect to dashboard
  const authenticated = await isAuthenticated()
  if (authenticated) {
    redirect("/admin/dashboard")
  }

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-2">
              <Image src="/invisible-logo.svg" alt="Invisible Logo" width={32} height={32} />
            </div>
            <span className="text-gray-700 font-semibold">INVISIBLE</span>
          </div>
          <Link href="/" className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">
            Back-end Login
          </Link>
        </div>

        <div className="p-6">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
