import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EyeOff, Wand2, Mic, Video, BookOpen, Sparkles, ArrowRight } from 'lucide-react'

const NOFACE_TEMPLATES = [
  {
    id: 'storytelling',
    name: 'Storytelling Mystère',
    desc: 'Narration sur vidéos atmosphériques. Idéal pour true crime, histoires paranormales.',
    niche: 'Storytelling',
    difficulty: 'Facile',
    avgViews: '50K-200K',
  },
  {
    id: 'motivation',
    name: 'Motivation & Développement',
    desc: 'Voix inspirante sur visuels cinématiques. Citations, conseils de vie.',
    niche: 'Motivation',
    difficulty: 'Facile',
    avgViews: '20K-100K',
  },
  {
    id: 'education',
    name: 'Éducatif Animé',
    desc: 'Explications avec animations et schémas. Science, tech, histoire.',
    niche: 'Éducation',
    difficulty: 'Moyen',
    avgViews: '30K-150K',
  },
  {
    id: 'comedy_dub',
    name: 'Doublage Comique',
    desc: 'Doublage humoristique sur vidéos existantes. Animaux, séries, films.',
    niche: 'Comédie',
    difficulty: 'Moyen',
    avgViews: '100K-500K',
  },
  {
    id: 'asmr',
    name: 'ASMR Ambiance',
    desc: 'Sons relaxants, ambiances visuelles. Aucun visage requis.',
    niche: 'ASMR',
    difficulty: 'Facile',
    avgViews: '10K-80K',
  },
  {
    id: 'compilation',
    name: 'Compilation Thématique',
    desc: 'Best-of, top 10, compilations. Montage automatique par l\'IA.',
    niche: 'Divertissement',
    difficulty: 'Facile',
    avgViews: '50K-300K',
  },
  {
    id: 'kids',
    name: 'Contenu Enfants',
    desc: 'Histoires animées, comptines, contenu éducatif pour enfants.',
    niche: 'Enfants',
    difficulty: 'Moyen',
    avgViews: '100K-1M',
  },
  {
    id: 'finance',
    name: 'Finance & Crypto',
    desc: 'Analyses marché, conseils investissement. Graphiques et data.',
    niche: 'Finance',
    difficulty: 'Avancé',
    avgViews: '20K-100K',
  },
]

const GUIDE_STEPS = [
  { step: 1, title: 'Choisissez votre niche', desc: 'Trouvez un sujet qui vous passionne et qui a une audience.' },
  { step: 2, title: 'Créez votre personnage', desc: 'Avatar, voix, identité — tout sans montrer votre visage.' },
  { step: 3, title: 'Générez votre 1ère vidéo', desc: 'L\'IA écrit le script, génère la voix, monte la vidéo.' },
  { step: 4, title: 'Publiez régulièrement', desc: 'La constance est la clé. 3x/semaine minimum.' },
  { step: 5, title: 'Analysez et optimisez', desc: 'Utilisez les analytics pour améliorer vos contenus.' },
  { step: 6, title: 'Monétisez', desc: 'Tokens, commandes, collabs — plusieurs sources de revenus.' },
]

export default async function NoFacePage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <div className="space-y-8 sm:space-y-10">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
            <EyeOff className="h-5 w-5 text-[#D4AF37]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
            NoFace Studio
          </h1>
        </div>
        <p className="text-white/40 mt-2 text-sm sm:text-base">
          Créez du contenu viral sans jamais montrer votre visage.
          Templates prêts à l&apos;emploi, workflows automatisés.
        </p>
      </div>

      {/* Guide */}
      <Card className="bg-gradient-to-r from-[#D4AF37]/5 to-transparent border-[#D4AF37]/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#D4AF37]" />
            Guide : De 0 à 100K sans montrer son visage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {GUIDE_STEPS.map((s) => (
              <div key={s.step} className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0 text-[#D4AF37] text-sm font-bold">
                  {s.step}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{s.title}</p>
                  <p className="text-white/30 text-xs mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Templates */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Templates NoFace</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {NOFACE_TEMPLATES.map((t) => (
            <Card key={t.id} className="bg-white/[0.03] border-white/10 hover:border-[#D4AF37]/30 transition-all group">
              <CardContent className="p-5 space-y-3">
                <div className="h-24 rounded-lg bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center">
                  <Video className="h-10 w-10 text-white/10 group-hover:text-[#D4AF37]/30 transition-colors" />
                </div>
                <h3 className="text-white font-semibold text-sm">{t.name}</h3>
                <p className="text-white/40 text-xs line-clamp-2">{t.desc}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] border-white/10 text-white/30">
                    {t.niche}
                  </Badge>
                  <span className="text-[10px] text-white/20">{t.avgViews} vues/vidéo</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <Badge variant="outline" className={`text-[10px] ${
                    t.difficulty === 'Facile' ? 'border-green-500/20 text-green-400' :
                    t.difficulty === 'Moyen' ? 'border-yellow-500/20 text-yellow-400' :
                    'border-red-500/20 text-red-400'
                  }`}>
                    {t.difficulty}
                  </Badge>
                  <Link
                    href={`/creator/generate?template=${t.id}`}
                    className="text-[#D4AF37] text-xs hover:underline flex items-center gap-1"
                  >
                    Utiliser <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Workflows */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#D4AF37]" />
            Workflows automatisés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { name: 'Doublage + Sous-titres', desc: 'Vidéo libre de droit → doublage IA → sous-titres animés → publication', cost: '15 tokens', icon: Mic },
            { name: 'Script → Vidéo complète', desc: 'Vous écrivez le script → IA génère voix + visuels + montage', cost: '10 tokens', icon: Video },
            { name: 'Recyclage de contenu', desc: '1 vidéo longue → 5 shorts optimisés par plateforme', cost: '20 tokens', icon: Wand2 },
          ].map((wf) => (
            <div key={wf.name} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <wf.icon className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">{wf.name}</p>
                  <p className="text-white/30 text-xs mt-0.5">{wf.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pl-[52px] sm:pl-0">
                <Badge variant="outline" className="border-[#D4AF37]/20 text-[#D4AF37] text-xs shrink-0">
                  {wf.cost}
                </Badge>
                <Link
                  href="/creator/generate"
                  className="px-4 py-1.5 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-medium rounded-lg hover:bg-[#D4AF37]/20 transition-colors min-h-[36px] inline-flex items-center"
                >
                  Lancer
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
