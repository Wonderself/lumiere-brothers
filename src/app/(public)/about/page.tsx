import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  Sparkles,
  Users,
  Globe,
  Rocket,
  ChevronRight,
  TrendingUp,
  Zap,
  ArrowRight,
  Star,
  Lightbulb,
  Target,
  Award,
  BookOpen,
  Building2,
  Palette,
  Video,
  PenTool,
  Music,
  Box,
  MapPin,
  HandshakeIcon,
  GraduationCap,
  BrainCircuit,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'À Propos — Lumière Creators',
  description:
    'Découvrez Lumière Creators : outils IA pour créateurs, micro-tâches guidées, collaboration. Fondé par Emmanuel Smadja et Eric Haldezos.',
}

/* ------------------------------------------------------------------ */
/* Static data                                                         */
/* ------------------------------------------------------------------ */

const teamMembers = [
  {
    name: 'Emmanuel Smadja',
    role: 'CEO & Co-Fondateur',
    bio: 'Ex-TF1 et Lagardère, Emmanuel apporte 20+ ans d\'expérience dans les médias et la tech. Expert-comptable #1 en France (CPA), membre du FinTech Advisory Board, il construit le pont entre Hollywood et la création IA.',
    highlights: ['TF1 & Lagardère', 'CPA #1 France', 'FinTech Advisory Board', 'Hollywood Bridge'],
    color: 'bg-blue-50 border-blue-200 text-blue-600',
    iconBg: 'bg-blue-100',
  },
  {
    name: 'Eric Haldezos',
    role: 'CCO & Co-Fondateur',
    bio: 'Réalisateur primé et pionnier du cinéma IA, Eric dirige la vision créative de Lumière. Ses courts-métrages IA ont été sélectionnés dans des festivals internationaux. Il est la preuve vivante que l\'IA amplifie la créativité humaine.',
    highlights: ['Réalisateur IA primé', 'Festivals internationaux', 'Direction créative', 'Vision artistique'],
    color: 'bg-purple-50 border-purple-200 text-purple-600',
    iconBg: 'bg-purple-100',
  },
]

const philosophy = [
  {
    icon: Lightbulb,
    title: 'We Don\'t Prompt. We Direct AI.',
    description: 'L\'IA n\'est pas un gadget. C\'est un outil de production professionnel. Nous guidons chaque créateur pour qu\'il dirige l\'IA comme un réalisateur dirige son équipe.',
  },
  {
    icon: Target,
    title: 'Accessible à Tous',
    description: 'Pas besoin d\'être expert. Chaque micro-tâche est découpée, guidée étape par étape, avec des exemples visuels et des outils recommandés. Du débutant au pro.',
  },
  {
    icon: Award,
    title: 'Qualité Professionnelle',
    description: 'Validation automatique par IA + relecture humaine. Chaque livrable atteint un standard professionnel, qu\'il s\'agisse d\'une vidéo, d\'un logo ou d\'un script.',
  },
]

const serviceCategories = [
  { icon: Video, name: 'Vidéo & Photo IA', description: 'Génération vidéo, retouche photo, montage, thumbnails, motion design', color: 'text-red-500', bg: 'bg-red-50 border-red-200' },
  { icon: PenTool, name: 'Contenu & Texte IA', description: 'Rédaction, scripts, sous-titres, traductions, voix off, SEO', color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200' },
  { icon: Palette, name: 'Design & Branding', description: 'Logos, identité visuelle, affiches, bannières, UI/UX', color: 'text-purple-500', bg: 'bg-purple-50 border-purple-200' },
  { icon: Music, name: 'Audio & Musique', description: 'Sound design, musique IA, mixage, podcast editing', color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200' },
  { icon: Box, name: '3D & Animation', description: 'Modélisation, animation, environnements, personnages', color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' },
]

const locations = [
  { city: 'Paris', country: 'France', description: 'Siège social, direction créative, partenariats médias', flag: '🇫🇷' },
  { city: 'Tel Aviv', country: 'Israël', description: 'R&D, innovation technologique, IA avancée', flag: '🇮🇱' },
  { city: 'Hollywood', country: 'USA', description: 'Distribution, réseau studios, marché américain', flag: '🇺🇸' },
]

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* ============================================================ */}
      {/* 1. HERO                                                      */}
      {/* ============================================================ */}
      <section className="relative py-24 md:py-36 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/[0.04] via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#D4AF37]/[0.04] rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-100/20 rounded-full blur-[100px]" />

        <div className="container mx-auto max-w-5xl relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4" />
              The Dreams Team
            </div>

            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight text-[#1A1A2E]"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              <span className="block">Démocratiser la</span>
              <span
                className="block"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 40%, #D4AF37 70%, #B8960C 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Création IA
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[#4A4A68] max-w-3xl mx-auto leading-relaxed mb-10">
              Lumière Creators donne à chaque créateur les outils, les micro-tâches guidées et la communauté
              pour transformer l&apos;intelligence artificielle en revenus concrets.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#D4AF37] hover:bg-[#C5A028] text-white font-semibold transition-colors text-lg shadow-sm"
              >
                <Rocket className="h-5 w-5" />
                Rejoindre les Créateurs
              </Link>
              <Link
                href="/tasks"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-[#E5E5E0] bg-white hover:bg-[#F5F5F3] text-[#1A1A2E] font-semibold transition-all text-lg shadow-sm"
              >
                <Star className="h-5 w-5 text-[#D4AF37]" />
                Explorer les Tâches
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. VISION — Avec image                                       */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/human-ai-connection-spark.png"
                alt="La connexion humain-IA au coeur de notre vision"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium mb-6">
                <Lightbulb className="h-3.5 w-3.5" />
                Notre Vision
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold mb-6 text-[#1A1A2E]"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                L&apos;IA amplifie la créativité.{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Pas la remplacer.
                </span>
              </h2>
              <div className="space-y-4 text-[#4A4A68] leading-relaxed">
                <p>
                  Nous croyons que l&apos;intelligence artificielle est le plus grand outil d&apos;empowerment
                  jamais créé pour les créateurs de contenu. Un freelance seul peut désormais produire
                  ce qu&apos;une agence entière réalisait hier.
                </p>
                <p>
                  Mais la technologie seule ne suffit pas. Il faut des <strong className="text-[#1A1A2E]">briefs clairs</strong>,
                  des <strong className="text-[#1A1A2E]">étapes guidées</strong>, des <strong className="text-[#1A1A2E]">outils recommandés</strong>,
                  et une <strong className="text-[#1A1A2E]">communauté bienveillante</strong> pour progresser.
                </p>
                <p className="text-[#1A1A2E] font-medium">
                  C&apos;est exactement ce que Lumière Creators construit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. PHILOSOPHIE                                               */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-5xl font-bold mb-4 text-[#1A1A2E]"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Notre{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Philosophie
              </span>
            </h2>
            <p className="text-[#4A4A68] max-w-2xl mx-auto">
              Trois principes guident chaque décision que nous prenons.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {philosophy.map((item) => (
              <div
                key={item.title}
                className="bg-[#FAFAF8] border border-[#E5E5E0] rounded-2xl p-8 hover:border-[#D4AF37]/30 hover:shadow-md transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-5">
                  <item.icon className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <h3
                  className="text-xl font-bold mb-3 text-[#1A1A2E]"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {item.title}
                </h3>
                <p className="text-[#4A4A68] leading-relaxed text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. L'ÉQUIPE — The Dreams Team                                */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium mb-6">
              <Users className="h-3.5 w-3.5" />
              The Dreams Team
            </div>
            <h2
              className="text-3xl md:text-5xl font-bold mb-4 text-[#1A1A2E]"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Les Fondateurs
            </h2>
            <p className="text-[#4A4A68] max-w-2xl mx-auto">
              Deux parcours complémentaires unis par une conviction : la création IA doit être accessible à tous.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-white border border-[#E5E5E0] rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-6">
                  <h3
                    className="text-2xl font-bold text-[#1A1A2E] mb-1"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {member.name}
                  </h3>
                  <p className="text-[#D4AF37] font-medium">{member.role}</p>
                </div>
                <p className="text-[#4A4A68] leading-relaxed mb-6">{member.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {member.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium ${member.color}`}
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Team photo */}
          <div className="mt-12 relative aspect-[21/9] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/images/lumiere-team-startup-office.png"
              alt="L'équipe Lumière Brothers Pictures"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white/90 text-lg font-medium" style={{ fontFamily: 'var(--font-playfair)' }}>
                Lumière Brothers Pictures — Paris, Tel Aviv, Hollywood
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. SERVICES — Ce qu'on offre aux créateurs                   */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-200 bg-purple-50 text-purple-600 text-sm font-medium mb-6">
              <GraduationCap className="h-3.5 w-3.5" />
              Micro-Tâches Guidées
            </div>
            <h2
              className="text-3xl md:text-5xl font-bold mb-4 text-[#1A1A2E]"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Des Services IA{' '}
              <span className="text-purple-600">Ultra-Guidés</span>
            </h2>
            <p className="text-[#4A4A68] max-w-2xl mx-auto">
              Chaque tâche est découpée en étapes claires, avec un brief détaillé, des exemples visuels
              et des outils recommandés. Accessible aux débutants comme aux experts.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceCategories.map((cat) => (
              <div
                key={cat.name}
                className={`${cat.bg} border rounded-xl p-6 hover:shadow-md transition-all duration-300`}
              >
                <cat.icon className={`h-8 w-8 ${cat.color} mb-4`} />
                <h3 className="font-semibold text-[#1A1A2E] mb-2">{cat.name}</h3>
                <p className="text-sm text-[#4A4A68] leading-relaxed">{cat.description}</p>
              </div>
            ))}

            {/* How it works mini-card */}
            <div className="bg-[#1A1A2E] text-white rounded-xl p-6 flex flex-col justify-between">
              <div>
                <Zap className="h-8 w-8 text-[#D4AF37] mb-4" />
                <h3 className="font-semibold mb-2">Comment ça marche ?</h3>
                <ol className="text-sm text-white/60 space-y-1.5 list-decimal list-inside">
                  <li>Inscrivez-vous gratuitement</li>
                  <li>Choisissez une tâche adaptée à votre niveau</li>
                  <li>Suivez le brief guidé étape par étape</li>
                  <li>Soumettez et recevez votre paiement</li>
                </ol>
              </div>
              <Link
                href="/tasks"
                className="inline-flex items-center gap-2 text-[#D4AF37] text-sm font-medium mt-4 hover:text-[#F0D060] transition-colors"
              >
                Explorer les tâches <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. PARTENARIAT — Éditions Ruppin                             */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-600 text-sm font-medium mb-6">
                <BookOpen className="h-3.5 w-3.5" />
                Partenariat Stratégique
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold mb-6 text-[#1A1A2E]"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Éditions Ruppin —{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Book-to-Screen
                </span>
              </h2>
              <div className="space-y-4 text-[#4A4A68] leading-relaxed">
                <p>
                  Lumière détient <strong className="text-[#1A1A2E]">33% des Éditions Ruppin</strong>, maison d&apos;édition
                  spécialisée dans la fiction. Ce partenariat nous donne un accès exclusif
                  à un catalogue de propriétés intellectuelles prêtes à être adaptées.
                </p>
                <p>
                  <strong className="text-[#1A1A2E]">First-look deal</strong> : chaque livre publié est évalué pour son potentiel
                  d&apos;adaptation en film IA. Les créateurs de notre plateforme peuvent participer
                  à ces adaptations via des micro-tâches dédiées.
                </p>
                <p>
                  <strong className="text-[#1A1A2E]">Co-owned IP</strong> : les droits sont partagés entre la maison d&apos;édition,
                  le studio, et les contributeurs qui participent à la production.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {['33% Equity', 'First-Look Deal', 'Co-Owned IP', 'Book-to-Screen Pipeline'].map((tag) => (
                  <span key={tag} className="inline-flex items-center px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/creative-studio-team-workspace.png"
                alt="Espace de travail créatif Lumière Creators"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. INFRASTRUCTURE — 3 Continents                             */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E5E5E0] bg-white text-[#4A4A68] text-sm font-medium mb-6 shadow-sm">
              <Globe className="h-3.5 w-3.5 text-[#D4AF37]" />
              Présence Mondiale
            </div>
            <h2
              className="text-3xl md:text-5xl font-bold mb-4 text-[#1A1A2E]"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              3 Continents,{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                1 Vision
              </span>
            </h2>
            <p className="text-[#4A4A68] max-w-2xl mx-auto">
              Une présence stratégique sur trois continents pour servir les créateurs du monde entier.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {locations.map((loc) => (
              <div
                key={loc.city}
                className="bg-[#FAFAF8] border border-[#E5E5E0] rounded-2xl p-8 text-center hover:border-[#D4AF37]/30 hover:shadow-md transition-all duration-300"
              >
                <span className="text-4xl mb-4 block">{loc.flag}</span>
                <h3 className="text-xl font-bold text-[#1A1A2E] mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {loc.city}
                </h3>
                <p className="text-[#D4AF37] text-sm font-medium mb-3">{loc.country}</p>
                <p className="text-sm text-[#4A4A68] leading-relaxed">{loc.description}</p>
              </div>
            ))}
          </div>

          {/* Infrastructure highlights */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Building2, label: 'CPA #1 France', desc: 'Réseau financier solide' },
              { icon: HandshakeIcon, label: 'FinTech Advisory', desc: 'Innovation financière' },
              { icon: BrainCircuit, label: 'IA de Pointe', desc: 'Claude, GPT, Midjourney' },
              { icon: MapPin, label: 'Hollywood Bridge', desc: 'Accès marché US' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 bg-[#FAFAF8] border border-[#E5E5E0] rounded-xl p-4">
                <div className="h-9 w-9 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                  <item.icon className="h-4.5 w-4.5 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="font-semibold text-[#1A1A2E] text-sm">{item.label}</p>
                  <p className="text-xs text-[#8E8EA0]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. PIPELINE DE PRODUCTION                                    */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600 text-sm font-medium mb-6">
              <TrendingUp className="h-3.5 w-3.5" />
              En Production
            </div>
            <h2
              className="text-3xl md:text-5xl font-bold mb-4 text-[#1A1A2E]"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Pipeline de{' '}
              <span className="text-emerald-600">Projets</span>
            </h2>
            <p className="text-[#4A4A68] max-w-2xl mx-auto">
              Des projets en cours qui créent des opportunités concrètes pour les créateurs.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                name: 'Project Heritage',
                desc: 'Adaptation cinématographique d\'oeuvres classiques du domaine public. Des dizaines de micro-tâches créatives : affiches, bandes-annonces, VFX, sound design.',
                status: 'En production',
                statusColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                tasks: '120+ tâches disponibles',
              },
              {
                name: 'Project Hybrid',
                desc: 'Film hybride mêlant acteurs réels et environnements générés par IA. Opportunités en 3D, compositing, color grading, et montage.',
                status: 'Pré-production',
                statusColor: 'bg-blue-100 text-blue-700 border-blue-200',
                tasks: '80+ tâches à venir',
              },
              {
                name: 'Project Pulse',
                desc: 'Série de courts-métrages explorant les limites de l\'IA narrative. Micro-tâches en écriture créative, storyboarding, voix off et musique.',
                status: 'Développement',
                statusColor: 'bg-purple-100 text-purple-700 border-purple-200',
                tasks: '60+ tâches planifiées',
              },
            ].map((project) => (
              <div
                key={project.name}
                className="bg-white border border-[#E5E5E0] rounded-2xl p-8 hover:border-[#D4AF37]/30 hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <h3
                    className="text-2xl font-bold text-[#1A1A2E]"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium ${project.statusColor}`}>
                      {project.status}
                    </span>
                    <span className="text-sm text-[#D4AF37] font-medium">
                      {project.tasks}
                    </span>
                  </div>
                </div>
                <p className="text-[#4A4A68] leading-relaxed">{project.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. CONTACT / CTA                                             */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/lumiere-office-contact-touch.png"
                alt="Bureau Lumière Brothers Pictures — Contactez-nous"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div>
              <h2
                className="text-3xl md:text-4xl font-bold mb-6 text-[#1A1A2E]"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Prêt à créer avec{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  nous ?
                </span>
              </h2>
              <p className="text-[#4A4A68] leading-relaxed mb-8">
                Que vous soyez créateur débutant ou professionnel expérimenté, client à la recherche
                de services IA, ou investisseur curieux — il y a une place pour vous chez Lumière Creators.
              </p>

              <div className="space-y-3 mb-8">
                <Link
                  href="/register"
                  className="flex items-center justify-between px-6 py-4 rounded-xl bg-[#D4AF37] hover:bg-[#C5A028] text-white font-semibold transition-colors shadow-sm"
                >
                  <span className="flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    Créer mon compte créateur
                  </span>
                  <ChevronRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/tasks"
                  className="flex items-center justify-between px-6 py-4 rounded-xl bg-[#FAFAF8] border border-[#E5E5E0] hover:border-[#D4AF37]/30 text-[#1A1A2E] font-semibold transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-[#D4AF37]" />
                    Parcourir les micro-tâches
                  </span>
                  <ChevronRight className="h-5 w-5 text-[#8E8EA0]" />
                </Link>
                <a
                  href="mailto:creators@lumiere.film"
                  className="flex items-center justify-between px-6 py-4 rounded-xl bg-[#FAFAF8] border border-[#E5E5E0] hover:border-[#D4AF37]/30 text-[#1A1A2E] font-semibold transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-purple-500" />
                    Partenariat & Presse
                  </span>
                  <ChevronRight className="h-5 w-5 text-[#8E8EA0]" />
                </a>
              </div>

              <p className="text-sm text-[#8E8EA0]">
                Lumière Brothers Pictures &middot; {new Date().getFullYear()} &middot; Paris · Tel Aviv · Hollywood
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
