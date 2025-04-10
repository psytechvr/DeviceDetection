"use client"

import { useState } from "react"
import { login } from "@/app/actions"

export function LoginForm() {
  const [error, setError] = useState("")

  const handleSubmit = async (formData: FormData) => {
    const result = await login(formData)
    if (!result.success) {
      setError(result.message)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Invisible Email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="LoremIpsum!"
          />
        </div>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button
        type="submit"
        className="w-full bg-purple-700 text-white py-2 rounded-md hover:bg-purple-800 transition-colors"
      >
        Login
      </button>
    </form>
  )
}
