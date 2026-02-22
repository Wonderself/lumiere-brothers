import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Next.js 16: proxy.ts replaces middleware.ts (nodejs runtime, no edge restrictions)
export async function proxy(req: NextRequest) {
  const { nextUrl } = req

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  })

  const isLoggedIn = !!token
  const isAdmin = token?.role === 'ADMIN'

  const protectedPaths = ['/dashboard', '/tasks', '/profile']
  const adminPaths = ['/admin']
  const authPaths = ['/login', '/register']

  const isProtected = protectedPaths.some((p) => nextUrl.pathname.startsWith(p))
  const isAdminPath = adminPaths.some((p) => nextUrl.pathname.startsWith(p))
  const isAuthPath = authPaths.some((p) => nextUrl.pathname.startsWith(p))

  if (isAdminPath) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login?callbackUrl=' + encodeURIComponent(nextUrl.pathname), nextUrl))
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', nextUrl))
    }
  }

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login?callbackUrl=' + encodeURIComponent(nextUrl.pathname), nextUrl))
  }

  if (isAuthPath && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|fonts).*)'],
}
