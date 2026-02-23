import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  ArrowRight,
  Sparkles,
  Video,
  BarChart3,
  Users,
  Wand2,
  Calendar,
  MessageSquare,
  CheckCircle,
  Star,
  Palette,
  Type,
  Music,
  Box,
  Camera,
  FileText,
  Mic,
  Globe,
  Zap,
  Shield,
  Clock,
  Award,
} from 'lucide-react'

const pillars = [
  {
    icon: Wand2,
    title: 'Créer',
    description: 'Outils IA pour générer vidéos, photos, contenus programmés. Brief personnalisé selon votre activité.',
    color: 'bg-blue-500/10 border-blue-500/20 text-blue-600',
    iconColor: 'text-blue-500',
  },
  {
    icon: Users,
    title: 'Collaborer',
    description: 'Marketplace de collaboration entre créateurs. Co-création, shoutouts, échanges de visibilité.',
    color: 'bg-purple-500/10 border-purple-500/20 text-purple-600',
    iconColor: 'text-purple-500',
  },
  {
    icon: Star,
    title: 'Gagner',
    description: 'Micro-tâches IA ultra-guidées. Réalisez des services IA pour des clients et soyez payé immédiatement.',
    color: 'bg-[#D4AF37]/10 border-[#D4AF37]/20 text-[#D4AF37]',
    iconColor: 'text-[#D4AF37]',
  },
]

const creatorTools = [
  { icon: Video, title: 'Génération Vidéo IA', desc: 'Créez des vidéos professionnelles en quelques clics grâce à l\'IA.' },
  { icon: Calendar, title: 'Planning & Scheduling', desc: 'Programmez vos publications sur toutes les plateformes à l\'avance.' },
  { icon: BarChart3, title: 'Analytics Avancés', desc: 'Suivez vos performances, vues, engagement et revenus en temps réel.' },
  { icon: MessageSquare, title: 'Brief Personnalisé', desc: 'Conseils et orientations basés sur votre niche, votre audience et vos objectifs.' },
]

const taskCategories = [
  { icon: Video, name: 'Vidéo & Photo IA', tasks: 'Génération vidéo, retouche photo, montage, thumbnails, motion design', price: '50-500€', color: 'bg-blue-50 border-blue-100' },
  { icon: Type, name: 'Contenu & Texte IA', tasks: 'Rédaction, scripts, sous-titres, traductions, voix off, SEO', price: '30-200€', color: 'bg-purple-50 border-purple-100' },
  { icon: Palette, name: 'Design & Branding', tasks: 'Logos, identité visuelle, affiches, bannières, UI/UX', price: '50-300€', color: 'bg-rose-50 border-rose-100' },
  { icon: Music, name: 'Audio & Musique', tasks: 'Sound design, musique IA, mixage, podcast editing', price: '40-250€', color: 'bg-green-50 border-green-100' },
  { icon: Box, name: '3D & Animation', tasks: 'Modélisation, animation, environnements, personnages', price: '100-500€', color: 'bg-amber-50 border-amber-100' },
]

const maltSteps = [
  { number: '1', title: 'Inscrivez-vous', desc: 'Créez votre profil en 2 minutes. Choisissez vos compétences et votre niveau.' },
  { number: '2', title: 'Choisissez une tâche', desc: 'Parcourez les tâches disponibles. Chaque tâche a un brief ultra-détaillé.' },
  { number: '3', title: 'Suivez le guide', desc: 'Instructions étape par étape. Outils recommandés. Exemples visuels. Accessible aux débutants.' },
  { number: '4', title: 'Livrez & soyez payé', desc: 'Soumettez. L\'IA valide. Paiement immédiat. Simple.' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative pt-20 pb-24 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#D4AF37]/[0.04] rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto max-w-6xl relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-5 py-2 text-sm text-[#D4AF37] font-medium mb-8">
                <Sparkles className="h-3.5 w-3.5" />
                Studio IA pour Créateurs
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                Créez sans limites.{' '}
                <span className="text-gold-gradient">L&apos;IA à votre service.</span>
              </h1>

              <p className="text-lg text-[#4A4A68] leading-relaxed mb-8 max-w-lg">
                Outils de création IA, marketplace de micro-tâches guidées, collaboration entre créateurs.
                Tout ce dont vous avez besoin pour créer, collaborer et gagner.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/register">
                  <Button size="xl" className="group text-base px-8 py-4 bg-[#D4AF37] hover:bg-[#C5A028] text-white">
                    Commencer Gratuitement
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/tasks">
                  <Button size="xl" variant="outline" className="text-base px-8 py-4 border-[#E5E5E0] text-[#4A4A68] hover:border-[#D4AF37]/30">
                    Voir les Tâches
                  </Button>
                </Link>
              </div>

              {/* Mini stats */}
              <div className="flex gap-8">
                {[
                  { value: '500+', label: 'Créateurs actifs' },
                  { value: '2K+', label: 'Tâches réalisées' },
                  { value: '150K€', label: 'Revenus distribués' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-[#D4AF37]" style={{ fontFamily: 'var(--font-playfair)' }}>{stat.value}</div>
                    <div className="text-xs text-[#8E8EA0] uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/creative-studio-team-workspace.png"
                  alt="Studio créatif Lumière Creators - Outils IA pour créateurs de contenu"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg border border-[#E5E5E0] p-4 max-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-[#D4AF37]" />
                  <span className="text-xs font-semibold text-[#D4AF37]">IA Guidée</span>
                </div>
                <p className="text-xs text-[#4A4A68]">Chaque tâche expliquée étape par étape</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 3 PILLARS ═══════════ */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-3">La Plateforme</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              3 Piliers, <span className="text-gold-gradient">1 Ambition</span>
            </h2>
            <p className="text-[#8E8EA0] text-lg max-w-xl mx-auto">Tout ce dont un créateur a besoin, en un seul endroit.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="rounded-2xl border border-[#E5E5E0] bg-white p-8 hover:shadow-lg hover:border-[#D4AF37]/20 transition-all duration-300 group">
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl border mb-6 ${pillar.color}`}>
                  <pillar.icon className={`h-6 w-6 ${pillar.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#1A1A2E]">{pillar.title}</h3>
                <p className="text-[#4A4A68] leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CREATOR TOOLS ═══════════ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-4">Outils Créateurs</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                Votre logiciel de création{' '}
                <span className="text-gold-gradient">tout-en-un</span>
              </h2>
              <p className="text-[#4A4A68] leading-relaxed mb-8">
                Vidéos, photos, contenus programmés à l&apos;avance. Brief et conseils personnalisés
                en fonction de votre activité. Tout est pensé pour maximiser votre impact.
              </p>
              <div className="space-y-4">
                {creatorTools.map((tool) => (
                  <div key={tool.title} className="flex gap-4 p-4 rounded-xl border border-[#E5E5E0] bg-white hover:shadow-md hover:border-[#D4AF37]/20 transition-all">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 shrink-0">
                      <tool.icon className="h-5 w-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1A1A2E] mb-1">{tool.title}</h4>
                      <p className="text-sm text-[#4A4A68]">{tool.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/images/content-creator-smartphone-corridor.png"
                alt="Créateur de contenu utilisant les outils IA Lumière Creators"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ MICRO-TÂCHES MALT ═══════════ */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-3">Marketplace</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Des Services IA <span className="text-gold-gradient">Ultra-Guidés</span>
            </h2>
            <p className="text-[#8E8EA0] text-lg max-w-2xl mx-auto">
              Comme MALT, mais pour des services IA découpés en micro-tâches.
              Chaque tâche est extrêmement détaillée et guidée étape par étape.
              Accessible aux débutants comme aux experts.
            </p>
          </div>

          {/* For Clients vs For Contributors */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 border border-blue-200 mb-5">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#1A1A2E]">Pour les Clients</h3>
              <p className="text-[#4A4A68] leading-relaxed mb-4">
                Commandez des services IA précis, livrés par notre communauté de créateurs qualifiés.
                Chaque livraison est validée par IA avant réception.
              </p>
              <ul className="space-y-2">
                {['Prix fixes et transparents', 'Livraison rapide (24-48h)', 'Validation IA automatique', 'Garantie satisfaction'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[#4A4A68]">
                    <CheckCircle className="h-4 w-4 text-blue-500 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-5">
                <Award className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#1A1A2E]">Pour les Contributeurs</h3>
              <p className="text-[#4A4A68] leading-relaxed mb-4">
                Gagnez de l&apos;argent en réalisant des tâches IA guidées. Pas besoin d&apos;être expert :
                chaque étape est expliquée en détail avec outils recommandés.
              </p>
              <ul className="space-y-2">
                {['Tâches guidées pas à pas', 'Paiement immédiat à validation', 'Montée en niveau progressive', 'Du ROOKIE au VIP'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[#4A4A68]">
                    <CheckCircle className="h-4 w-4 text-[#D4AF37] shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Task Categories */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-center mb-6 text-[#1A1A2E]">Catégories de Services</h3>
            {taskCategories.map((cat) => (
              <div key={cat.name} className={`flex items-center justify-between p-5 rounded-xl border ${cat.color} hover:shadow-md transition-all`}>
                <div className="flex items-center gap-4">
                  <cat.icon className="h-5 w-5 text-[#D4AF37]" />
                  <div>
                    <h4 className="font-semibold text-[#1A1A2E]">{cat.name}</h4>
                    <p className="text-sm text-[#4A4A68]">{cat.tasks}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#D4AF37] whitespace-nowrap ml-4">{cat.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW MALT WORKS ═══════════ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-3">Comment ça Marche</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              4 Étapes, <span className="text-gold-gradient">0 Complexité</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {maltSteps.map((step, i) => (
              <div key={step.number} className="text-center relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37] text-white text-xl font-bold mx-auto mb-5 shadow-lg shadow-[#D4AF37]/20">
                  {step.number}
                </div>
                <h4 className="font-bold text-[#1A1A2E] mb-2">{step.title}</h4>
                <p className="text-sm text-[#4A4A68] leading-relaxed">{step.desc}</p>
                {i < maltSteps.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[calc(50%+28px)] w-[calc(100%-56px)] h-px bg-[#D4AF37]/20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ COLLABORATION ═══════════ */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl order-2 lg:order-1">
              <Image
                src="/images/diverse-team-brainstorming-collab.png"
                alt="Équipe de créateurs collaborant sur un projet IA"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-4">Collaboration</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                Trouvez vos <span className="text-gold-gradient">partenaires idéaux</span>
              </h2>
              <p className="text-[#4A4A68] leading-relaxed mb-8">
                Notre marketplace de collaboration connecte les créateurs entre eux.
                Co-création, shoutouts, échanges, commandes personnalisées.
                Un écosystème complet pour grandir ensemble.
              </p>
              <div className="space-y-3">
                {[
                  { icon: Users, label: 'Co-Créations', desc: 'Travaillez ensemble sur des projets communs' },
                  { icon: MessageSquare, label: 'Shoutouts & Échanges', desc: 'Augmentez votre visibilité mutuellement' },
                  { icon: FileText, label: 'Commandes Personnalisées', desc: 'Clients et créateurs connectés directement' },
                  { icon: Shield, label: 'Escrow Sécurisé', desc: 'Paiements protégés via notre système de Lumens' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4 p-4 rounded-xl border border-[#E5E5E0] bg-white hover:shadow-md transition-all">
                    <item.icon className="h-5 w-5 text-[#D4AF37] shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm text-[#1A1A2E]">{item.label}</h4>
                      <p className="text-xs text-[#4A4A68]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ ABOUT TEASER ═══════════ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-4">Qui sommes-nous</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                Lumière Brothers Pictures
              </h2>
              <p className="text-[#4A4A68] leading-relaxed mb-4">
                Fondé par Emmanuel Smadja (CEO, ex-TF1/Lagardère) et Eric Haldezos
                (CCO, réalisateur IA primé), notre studio fusionne l&apos;expertise Prime Time
                avec la puissance de l&apos;IA.
              </p>
              <p className="text-[#8E8EA0] leading-relaxed mb-6">
                De Paris à Tel Aviv en passant par Hollywood, nous créons les outils
                qui permettent à chaque créateur de libérer son potentiel grâce à l&apos;IA.
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#C5A028] transition-colors font-medium">
                Découvrir notre histoire <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/images/human-ai-connection-spark.png"
                alt="Connexion humain-IA - La vision de Lumière Brothers Pictures"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CTA FINAL ═══════════ */}
      <section className="py-24 px-4 bg-[#1A1A2E] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent pointer-events-none" />
        <div className="container mx-auto max-w-3xl text-center relative">
          <Image
            src="/images/lumiere-brothers-logo-creators-light.png"
            alt="Lumière Brothers Pictures Logo"
            width={160}
            height={80}
            className="mx-auto mb-8 opacity-30 invert"
          />
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            Prêt à créer avec{' '}
            <span className="text-gold-gradient">l&apos;IA ?</span>
          </h2>
          <p className="text-xl text-white/60 mb-10">
            Rejoignez la communauté des créateurs qui utilisent l&apos;IA pour aller plus loin.
            Gratuit et sans engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="xl" className="group text-base px-8 py-4 bg-[#D4AF37] hover:bg-[#C5A028] text-black font-bold">
                Créer mon Compte Gratuit
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/tasks">
              <Button size="xl" variant="outline" className="text-base px-8 py-4 border-white/20 text-white hover:bg-white/10">
                Explorer les Tâches
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
