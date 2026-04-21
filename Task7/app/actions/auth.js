"use server"

import { connectDB } from "../lib/db"
import User from "../models/User"
import bcryptjs from "bcryptjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// ---------------- SIGNUP ----------------
export async function signup(prevState, formData) {
  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required." }
  }

  try {
    await connectDB()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return { error: "An account with this email already exists." }
    }

    const hashedPassword = await bcryptjs.hash(password, 10)
    await User.create({ email, password: hashedPassword })
  } catch (err) {
    return { error: "Something went wrong. Please try again." }
  }

  redirect("/login")
}

// ---------------- LOGIN ----------------
export async function login(prevState, formData) {
  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required." }
  }

  try {
    await connectDB()

    const user = await User.findOne({ email })
    if (!user) {
      return { error: "No account found with this email." }
    }

    const isMatch = await bcryptjs.compare(password, user.password)
    if (!isMatch) {
      return { error: "Incorrect password." }
    }

    const cookieStore = await cookies()
    cookieStore.set("user", user.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
  } catch (err) {
    return { error: "Something went wrong. Please try again." }
  }

  redirect("/dashboard")
}

// ---------------- LOGOUT ----------------
export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("user")
  redirect("/login")
}
