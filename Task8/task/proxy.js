import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Already logged in — skip the login page
  if (pathname.startsWith("/login")) {
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return NextResponse.redirect(new URL(`/dashboard/${decoded.role}`, request.url));
      } catch {
        // invalid token — show login
      }
    }
    return NextResponse.next();
  }

  // Protected dashboard routes
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Prevent employees from accessing /dashboard/owner and vice versa
  if (pathname.startsWith("/dashboard/owner") && decoded.role !== "owner") {
    return NextResponse.redirect(new URL(`/dashboard/${decoded.role}`, request.url));
  }
  if (pathname.startsWith("/dashboard/employee") && decoded.role !== "employee") {
    return NextResponse.redirect(new URL(`/dashboard/${decoded.role}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/owner/:path*", "/dashboard/employee/:path*"],
};
