import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { logout } from "../actions/auth"

export default async function Dashboard() {
  const cookieStore = await cookies()
  const user = cookieStore.get("user")

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 text-center">

          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            👋
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome back!</h1>
          <p className="text-gray-500 mb-6 break-all text-sm">{user.value}</p>

          <form action={logout}>
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-8 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              Logout
            </button>
          </form>

        </div>
      </main>

      {/* Footer - required */}
      <footer className="py-4 text-center text-sm text-gray-500 border-t border-gray-200 bg-white">
        © 2026 i23-0502 Rayyan - All Rights Reserved
      </footer>

    </div>
  )
}
