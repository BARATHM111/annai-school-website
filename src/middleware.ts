import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // If user is signing out from admin route, redirect to home
    if (req.nextUrl.pathname === "/api/auth/signout" && 
        req.headers.get("referer")?.includes("/admin/")) {
      return NextResponse.redirect(new URL("/", req.url))
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true, // Allow all requests to pass through
    },
  }
)

export const config = {
  matcher: [
    "/api/auth/:path*",
    "/admin/:path*"
  ]
}
