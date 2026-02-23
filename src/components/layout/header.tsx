'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Film,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Star,
  User,
  X,
  Clapperboard,
  Trophy,
  BookOpen,
  CreditCard,
  Bell,
  Sun,
  FileText,
  ChevronDown,
  Play,
  Users,
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { AnimatePresence, MotionDiv } from '@/components/ui/motion'
import { NotificationBell } from '@/components/layout/notification-bell'
import { LumensCounter } from '@/components/layout/lumens-counter'

const publicNavLinks = [
  { href: '/streaming', label: 'Streaming', icon: Play },
  { href: '/films', label: 'Films', icon: Film },
  { href: '/actors', label: 'Acteurs', icon: User },
  { href: '/community', label: 'Communaute', icon: Users },
]

const authNavLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Taches', icon: Star },
]

export function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isAdmin = session?.user?.role === 'ADMIN'
  const userName = session?.user?.name || session?.user?.email || ''

  // Combine nav links based on auth status
  const navLinks = [
    ...publicNavLinks,
    ...(session?.user ? authNavLinks : []),
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-2xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <Clapperboard className="h-7 w-7 text-[#D4AF37] group-hover:text-[#C4A030] transition-colors duration-300" />
            <div className="absolute inset-0 blur-lg bg-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span
            className="text-xl font-bold tracking-wider text-[#1A1A2E] hidden xs:block"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            LUMIERE
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'text-[#D4AF37]'
                    : 'text-gray-600 hover:text-[#D4AF37]'
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#D4AF37] rounded-full" />
                )}
              </Link>
            )
          })}
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                'relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                pathname.startsWith('/admin')
                  ? 'text-[#D4AF37]'
                  : 'text-gray-600 hover:text-[#D4AF37]'
              )}
            >
              <Settings className="h-4 w-4" />
              Admin
              {pathname.startsWith('/admin') && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#D4AF37] rounded-full" />
              )}
            </Link>
          )}
        </nav>

        {/* Right section */}
        <div className="hidden md:flex items-center gap-2">
          {session?.user ? (
            <div className="flex items-center gap-2">
              {/* Notification Bell */}
              <NotificationBell />

              {/* Lumens */}
              <LumensCounter />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-gray-50 transition-all outline-none">
                    <Avatar className="h-8 w-8">
                      {session.user.image && <AvatarImage src={session.user.image} alt={userName} />}
                      <AvatarFallback className="text-xs bg-[#D4AF37]/10 text-[#D4AF37]">
                        {getInitials(userName)}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-3 w-3 text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-[#1A1A2E]">{userName}</p>
                      <p className="text-xs text-gray-400">{session.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      Mon Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/payments" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="h-4 w-4" />
                      Paiements
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/lumens" className="flex items-center gap-2 cursor-pointer">
                      <Sun className="h-4 w-4" />
                      Mes Lumens
                    </Link>
                  </DropdownMenuItem>
                  {(session.user as { role?: string }).role === 'SCREENWRITER' && (
                    <DropdownMenuItem asChild>
                      <Link href="/screenplays" className="flex items-center gap-2 cursor-pointer">
                        <FileText className="h-4 w-4" />
                        Mes Scenarios
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2 cursor-pointer">
                          <Settings className="h-4 w-4" />
                          Administration
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Se deconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#1A1A2E]">Se connecter</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-[#D4AF37] text-white hover:bg-[#C4A030] font-semibold rounded-full px-6 shadow-[0_2px_12px_rgba(212,175,55,0.2)] transition-all duration-200">
                  S&apos;inscrire
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-500 hover:text-[#1A1A2E] p-2 rounded-lg hover:bg-gray-50 transition-all"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px]',
                      pathname.startsWith(link.href)
                        ? 'text-[#D4AF37] bg-[#D4AF37]/[0.06]'
                        : 'text-gray-600 hover:text-[#D4AF37] hover:bg-gray-50'
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                )
              })}
              {session?.user ? (
                <>
                  <div className="h-px bg-gray-100 my-2" />
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:text-[#D4AF37] hover:bg-gray-50 rounded-lg transition-all duration-200 min-h-[44px]">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:text-[#D4AF37] hover:bg-gray-50 rounded-lg transition-all duration-200 min-h-[44px]">
                    <User className="h-4 w-4" /> Profil
                  </Link>
                  <Link href="/lumens" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:text-[#D4AF37] hover:bg-gray-50 rounded-lg transition-all duration-200 min-h-[44px]">
                    <Sun className="h-4 w-4 text-[#D4AF37]" /> Mes Lumens
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:text-[#D4AF37] hover:bg-gray-50 rounded-lg transition-all duration-200 min-h-[44px]">
                      <Settings className="h-4 w-4" /> Admin
                    </Link>
                  )}
                  <div className="h-px bg-gray-100 my-2" />
                  <button
                    onClick={() => { signOut({ callbackUrl: '/' }); setMobileOpen(false) }}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg w-full transition-all duration-200 min-h-[44px]"
                  >
                    <LogOut className="h-4 w-4" /> Se deconnecter
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-3">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full min-h-[44px] border-gray-200 text-gray-600">Se connecter</Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1">
                    <Button size="sm" className="w-full min-h-[44px] bg-[#D4AF37] text-white hover:bg-[#C4A030] font-semibold rounded-full">S&apos;inscrire</Button>
                  </Link>
                </div>
              )}
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </header>
  )
}
