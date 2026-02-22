'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard,
  Star,
  User,
  CreditCard,
  Trophy,
  Film,
  Settings,
  Users,
  ClipboardCheck,
  BarChart3,
  Sun,
  Bell,
  FileText,
  Landmark,
  ListTodo,
  Wallet,
  TrendingUp,
  Heart,
  Clapperboard,
  Video,
  Calendar,
  Wand2,
  EyeOff,
  Handshake,
  ShoppingCart,
  Gift,
  Megaphone,
  Play,
  LinkIcon,
  Shield,
  PieChart,
  DollarSign,
  AlertTriangle,
  Award,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { useState, useEffect } from 'react'

const LEVEL_LABELS_MAP: Record<string, string> = {
  ROOKIE: 'Rookie',
  PRO: 'Pro',
  EXPERT: 'Expert',
  VIP: 'VIP',
}

type NavLink = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  exact?: boolean
  badge?: string
}

type NavSection = {
  title: string
  color: string      // Module accent color
  hoverBg: string    // Hover background
  activeBg: string   // Active background
  activeBorder: string
  links: NavLink[]
}

// ======= MAIN USER NAVIGATION (5 modules) =======
const mainNavSections: NavSection[] = [
  {
    title: 'Principal',
    color: 'text-[#D4AF37]',
    hoverBg: 'hover:bg-[#D4AF37]/[0.04]',
    activeBg: 'bg-[#D4AF37]/10',
    activeBorder: 'border-[#D4AF37]/15',
    links: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { href: '/streaming', label: 'Streaming', icon: Play },
      { href: '/notifications', label: 'Notifications', icon: Bell },
    ],
  },
  {
    title: 'Studio Films',
    color: 'text-[#D4AF37]',
    hoverBg: 'hover:bg-[#D4AF37]/[0.04]',
    activeBg: 'bg-[#D4AF37]/10',
    activeBorder: 'border-[#D4AF37]/15',
    links: [
      { href: '/tasks', label: 'Micro-tâches', icon: Star },
      { href: '/films', label: 'Films', icon: Film },
      { href: '/screenplays', label: 'Scénarios', icon: FileText },
      { href: '/creator/credits', label: 'Mes Crédits', icon: Award },
    ],
  },
  {
    title: 'Créateur IA',
    color: 'text-purple-400',
    hoverBg: 'hover:bg-purple-500/[0.04]',
    activeBg: 'bg-purple-500/10',
    activeBorder: 'border-purple-500/15',
    links: [
      { href: '/creator', label: 'Mon Studio', icon: Clapperboard, exact: true },
      { href: '/creator/generate', label: 'Générer Vidéo', icon: Wand2 },
      { href: '/creator/videos', label: 'Mes Vidéos', icon: Video },
      { href: '/creator/schedule', label: 'Planning', icon: Calendar },
      { href: '/creator/noface', label: 'NoFace', icon: EyeOff },
      { href: '/creator/accounts', label: 'Réseaux', icon: LinkIcon },
    ],
  },
  {
    title: 'Collabs & Growth',
    color: 'text-green-400',
    hoverBg: 'hover:bg-green-500/[0.04]',
    activeBg: 'bg-green-500/10',
    activeBorder: 'border-green-500/15',
    links: [
      { href: '/collabs', label: 'Marketplace', icon: Handshake, exact: true },
      { href: '/collabs/orders', label: 'Commandes', icon: ShoppingCart },
      { href: '/collabs/referrals', label: 'Parrainages', icon: Gift },
      { href: '/collabs/outreach', label: 'Outreach', icon: Megaphone },
      { href: '/collabs/achievements', label: 'Trophées', icon: Trophy },
    ],
  },
  {
    title: 'Analytics & Tokens',
    color: 'text-blue-400',
    hoverBg: 'hover:bg-blue-500/[0.04]',
    activeBg: 'bg-blue-500/10',
    activeBorder: 'border-blue-500/15',
    links: [
      { href: '/analytics', label: 'Statistiques', icon: PieChart },
      { href: '/lumens', label: 'Mes Tokens', icon: Sun },
      { href: '/subscription', label: 'Abonnement', icon: Heart },
    ],
  },
  {
    title: 'Mon Compte',
    color: 'text-white/50',
    hoverBg: 'hover:bg-white/[0.03]',
    activeBg: 'bg-white/[0.06]',
    activeBorder: 'border-white/10',
    links: [
      { href: '/profile', label: 'Profil', icon: User },
      { href: '/profile/payments', label: 'Paiements', icon: CreditCard },
      { href: '/leaderboard', label: 'Classement', icon: Trophy },
    ],
  },
]

// ======= ADMIN NAVIGATION =======
const adminNavSections: NavSection[] = [
  {
    title: 'Administration',
    color: 'text-orange-400',
    hoverBg: 'hover:bg-orange-500/[0.04]',
    activeBg: 'bg-orange-500/10',
    activeBorder: 'border-orange-500/15',
    links: [
      { href: '/admin', label: 'Vue Globale', icon: BarChart3, exact: true },
      { href: '/admin/interventions', label: 'Interventions', icon: AlertTriangle },
      { href: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
    ],
  },
  {
    title: 'Contenu',
    color: 'text-[#D4AF37]',
    hoverBg: 'hover:bg-[#D4AF37]/[0.04]',
    activeBg: 'bg-[#D4AF37]/10',
    activeBorder: 'border-[#D4AF37]/15',
    links: [
      { href: '/admin/films', label: 'Films Studio', icon: Film },
      { href: '/admin/tasks', label: 'Tâches', icon: Star },
      { href: '/admin/screenplays', label: 'Scénarios', icon: FileText },
      { href: '/admin/catalog', label: 'Catalogue Streaming', icon: Play },
    ],
  },
  {
    title: 'Utilisateurs & Finance',
    color: 'text-green-400',
    hoverBg: 'hover:bg-green-500/[0.04]',
    activeBg: 'bg-green-500/10',
    activeBorder: 'border-green-500/15',
    links: [
      { href: '/admin/users', label: 'Utilisateurs', icon: Users },
      { href: '/admin/reputation', label: 'Réputation', icon: Shield },
      { href: '/admin/payments', label: 'Paiements', icon: Wallet },
      { href: '/admin/payouts', label: 'Payouts Créateurs', icon: DollarSign },
      { href: '/admin/reviews', label: 'Reviews IA', icon: ClipboardCheck },
    ],
  },
  {
    title: 'Système',
    color: 'text-white/50',
    hoverBg: 'hover:bg-white/[0.03]',
    activeBg: 'bg-white/[0.06]',
    activeBorder: 'border-white/10',
    links: [
      { href: '/admin/funding', label: 'Aides Publiques', icon: Landmark },
      { href: '/admin/todo-fondateur', label: 'TODO Fondateur', icon: ListTodo },
      { href: '/admin/settings', label: 'Paramètres', icon: Settings },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'
  const isAdminPage = pathname.startsWith('/admin')
  const userLevel = (session?.user as { level?: string })?.level
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const sections = isAdminPage && isAdmin ? adminNavSections : mainNavSections

  const sidebarContent = (
    <>
      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-5 overflow-y-auto scrollbar-thin">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="px-3 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-[0.15em]"
               style={{ color: 'rgba(255,255,255,0.2)' }}>
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.links.map((link) => {
                const isActive = link.exact
                  ? pathname === link.href
                  : pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 group',
                      isActive
                        ? `${section.activeBg} ${section.color} border ${section.activeBorder}`
                        : `text-white/40 ${section.hoverBg} hover:text-white/70`
                    )}
                  >
                    <link.icon className={cn(
                      'h-4 w-4 shrink-0 transition-colors',
                      isActive ? section.color : 'text-white/30 group-hover:text-white/50'
                    )} />
                    <span className="flex-1">{link.label}</span>
                    {link.badge && (
                      <Badge className="text-[9px] px-1.5 py-0 h-4 bg-red-500/20 text-red-400 border-red-500/30">
                        {link.badge}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Quick links to user section when in admin */}
      {isAdminPage && isAdmin && (
        <div className="px-3 pb-3">
          <Separator className="mb-3" />
          <p className="px-3 pb-2 text-[10px] font-semibold text-white/20 uppercase tracking-[0.15em]">
            Utilisateur
          </p>
          {[
            { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { href: '/creator', label: 'Créateur IA', icon: Clapperboard },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-white/30 hover:text-white/60 hover:bg-white/[0.03] transition-all"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* User Card */}
      {session?.user && (
        <div className="p-3 border-t border-white/5">
          <Link
            href="/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.03] transition-all group"
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className="text-xs bg-[#D4AF37]/10 text-[#D4AF37]">
                {getInitials(session.user.name || session.user.email || '')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/70 truncate group-hover:text-white/90 transition-colors">
                {session.user.name || 'Utilisateur'}
              </p>
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-[#D4AF37]/20 text-[#D4AF37]/70">
                  {LEVEL_LABELS_MAP[userLevel || 'ROOKIE'] || 'Rookie'}
                </Badge>
              </div>
            </div>
          </Link>
        </div>
      )}
    </>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 h-10 w-10 rounded-lg bg-[#0A0A0A]/90 border border-white/10 flex items-center justify-center text-white/60 hover:text-white/90 transition-colors"
        aria-label="Ouvrir le menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'lg:hidden fixed top-0 left-0 z-50 w-72 h-full bg-[#0A0A0A] border-r border-white/5 flex flex-col transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-3 flex items-center justify-between border-b border-white/5">
          <span className="text-sm font-bold text-[#D4AF37] font-[family-name:var(--font-playfair)]">Lumière</span>
          <button onClick={() => setMobileOpen(false)} className="h-8 w-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/40">
            <X className="h-4 w-4" />
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 border-r border-white/5 bg-[#0A0A0A]/50 backdrop-blur-sm min-h-[calc(100vh-64px)] flex-col">
        {sidebarContent}
      </aside>
    </>
  )
}
