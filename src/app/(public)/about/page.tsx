import { FileText, Layers, Users, Film, Cpu, Shield, Coins, Sparkles } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'À propos',
  description:
    'Découvrez Lumière, la plateforme collaborative de production de films IA. Notre mission : démocratiser le cinéma grâce à l\'intelligence artificielle et la communauté.',
}

const steps = [
  {
    icon: FileText,
    title: 'Soumission & Évaluation',
    description: 'Un scénario est soumis et évalué par IA pour sa faisabilité, son originalité et son potentiel cinématographique.',
  },
  {
    icon: Layers,
    title: 'Découpage en Micro-Tâches',
    description: 'Le film est découpé en micro-tâches : dialogues, storyboards, musique, VFX, montage, doublage...',
  },
  {
    icon: Users,
    title: 'Réalisation Collaborative',
    description: 'La communauté de créateurs réalise les tâches, validées par IA puis par des pairs experts.',
  },
  {
    icon: Film,
    title: 'Assemblage & Distribution',
    description: 'Le film est assemblé automatiquement et distribué sur la plateforme, avec revenus partagés équitablement.',
  },
]

const techFeatures = [
  {
    icon: Cpu,
    title: 'IA Claude',
    description:
      'Notre pipeline de production est alimenté par Claude d\'Anthropic pour l\'évaluation des scénarios, la validation des soumissions et le feedback intelligent.',
  },
  {
    icon: Shield,
    title: 'Provenance SHA-256',
    description:
      'Chaque contribution est hashée et horodatée avec SHA-256, garantissant la traçabilité et la preuve de paternité de chaque élément du film.',
  },
  {
    icon: Coins,
    title: 'Lumens (Crédits EUR)',
    description:
      'Les Lumens sont notre monnaie interne indexée sur l\'euro. Gagnez des Lumens en réalisant des tâches, dépensez-les ou convertissez-les en euros.',
  },
  {
    icon: Sparkles,
    title: 'Pipeline Automatisé',
    description:
      'De la soumission à la distribution, notre pipeline gère le transcoding, le sous-titrage multi-langues et l\'assemblage final automatiquement.',
  },
]

const team = [
  {
    name: 'Alexandre Moreau',
    role: 'CEO & Co-fondateur',
    bio: 'Ancien producteur chez Gaumont. 15 ans d\'expérience dans la production cinématographique et la transformation numérique.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  },
  {
    name: 'Sophie Laurent',
    role: 'CTO & Co-fondatrice',
    bio: 'Ex-ingénieure senior chez Google DeepMind. Spécialiste en IA générative et systèmes distribués à grande échelle.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  },
  {
    name: 'Marc Dubois',
    role: 'Directeur Artistique',
    bio: 'Réalisateur primé au Festival de Cannes. Passionné par l\'intersection entre art traditionnel et intelligence artificielle.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
  },
  {
    name: 'Claire Fontaine',
    role: 'Head of AI',
    bio: 'Docteure en NLP de l\'ENS Paris. Ancienne chercheuse chez Mistral AI. Experte en évaluation automatique de contenus créatifs.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
  },
]

const partners = [
  {
    name: 'BPI France',
    description: 'Banque Publique d\'Investissement — soutien à l\'innovation et au financement des startups deeptech.',
  },
  {
    name: 'CNC',
    description: 'Centre National du Cinéma — accompagnement des nouvelles formes de création audiovisuelle.',
  },
  {
    name: 'French Tech',
    description: 'Label d\'excellence pour les startups françaises à fort potentiel de croissance internationale.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent" />
        <div className="container mx-auto max-w-5xl relative">
          <div className="text-center">
            <div className="inline-block px-4 py-1.5 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-[#D4AF37] text-sm font-medium mb-6">
              L&apos;Uber du Film IA
            </div>
            <h1
              className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Notre Mission
            </h1>
            <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto leading-relaxed">
              Démocratiser la production de films grâce à l&apos;intelligence artificielle
              et la collaboration de milliers de créateurs dans le monde.
            </p>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Comment ça marche
          </h2>
          <p className="text-white/40 text-center mb-16 max-w-2xl mx-auto">
            De l&apos;idée au grand écran, en 4 étapes simples.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl p-6 hover:border-[#D4AF37]/30 hover:bg-white/[0.05] transition-all duration-300 group"
              >
                <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-[#D4AF37] text-black text-sm font-bold flex items-center justify-center">
                  {index + 1}
                </div>
                <div className="h-12 w-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-4 group-hover:bg-[#D4AF37]/20 transition-colors">
                  <step.icon className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{step.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre Technologie */}
      <section className="py-20 px-4 bg-white/[0.01]">
        <div className="container mx-auto max-w-5xl">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Notre Technologie
          </h2>
          <p className="text-white/40 text-center mb-16 max-w-2xl mx-auto">
            Une infrastructure de pointe au service de la création cinématographique.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {techFeatures.map((feature) => (
              <div
                key={feature.title}
                className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl p-6 hover:border-[#D4AF37]/20 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                    <feature.icon className="h-5 w-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* L'Équipe */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            L&apos;Équipe
          </h2>
          <p className="text-white/40 text-center mb-16 max-w-2xl mx-auto">
            Des experts passionnés par le cinéma et la technologie.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl p-6 text-center hover:border-[#D4AF37]/30 hover:bg-white/[0.05] transition-all duration-300 group"
              >
                <div className="relative mx-auto mb-4 h-24 w-24 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#D4AF37]/40 transition-colors">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-sm text-[#D4AF37] font-medium mb-3">{member.role}</p>
                <p className="text-xs text-white/40 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos Partenaires */}
      <section className="py-20 px-4 bg-white/[0.01]">
        <div className="container mx-auto max-w-5xl">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Nos Partenaires
          </h2>
          <p className="text-white/40 text-center mb-16 max-w-2xl mx-auto">
            Soutenus par les institutions majeures de l&apos;innovation et du cinéma en France.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl p-8 text-center hover:border-[#D4AF37]/20 transition-all duration-300"
              >
                <div className="h-16 w-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#D4AF37] font-bold text-lg" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {partner.name.split(' ').map((w) => w[0]).join('')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{partner.name}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl p-12">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Rejoignez l&apos;aventure
            </h2>
            <p className="text-white/50 mb-8 max-w-xl mx-auto">
              Que vous soyez scénariste, monteur, musicien, acteur ou passionné d&apos;IA,
              votre talent a sa place dans le cinéma de demain.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#C5A028] text-black font-semibold transition-colors text-lg"
            >
              Créer mon compte
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="text-white/30 text-sm mt-4">
              Gratuit et sans engagement
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
