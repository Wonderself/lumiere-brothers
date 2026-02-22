// Using require for CommonJS compatibility in seed scripts
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🎬 Seeding Lumière database...\n')

  // =============================================
  // ADMIN SETTINGS
  // =============================================
  await prisma.adminSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      aiConfidenceThreshold: 70,
      maxConcurrentTasks: 3,
      bitcoinEnabled: false,
      maintenanceMode: false,
      lumenPrice: 1.0,
      lumenRewardPerTask: 10,
      notifEmailEnabled: false,
    },
  })
  console.log('✅ AdminSettings créés')

  // =============================================
  // USERS (10 variés)
  // =============================================
  const pw = await bcrypt.hash('Admin1234!', 12)
  const pwUser = await bcrypt.hash('Test1234!', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@lumiere.film' },
    update: {},
    create: {
      email: 'admin@lumiere.film',
      passwordHash: pw,
      displayName: 'Admin Lumière',
      role: 'ADMIN',
      level: 'VIP',
      isVerified: true,
      verifiedAt: new Date(),
      points: 99999,
      lumenBalance: 5000,
      skills: ['Direction Artistique', 'Prompt Engineering', 'VFX / Compositing'],
      languages: ['Français', 'English', 'עברית'],
    },
  })

  const contributor = await prisma.user.upsert({
    where: { email: 'contributeur@lumiere.film' },
    update: {},
    create: {
      email: 'contributeur@lumiere.film',
      passwordHash: pwUser,
      displayName: 'Jean Créatif',
      role: 'CONTRIBUTOR',
      level: 'PRO',
      isVerified: true,
      verifiedAt: new Date(),
      points: 750,
      tasksCompleted: 8,
      tasksValidated: 7,
      rating: 4.5,
      lumenBalance: 120,
      skills: ['Prompt Engineering', 'Image Generation', 'Translation'],
      languages: ['Français', 'English'],
    },
  })

  const artist = await prisma.user.upsert({
    where: { email: 'artiste@lumiere.film' },
    update: {},
    create: {
      email: 'artiste@lumiere.film',
      passwordHash: pwUser,
      displayName: 'Sophie Visuelle',
      role: 'ARTIST',
      level: 'EXPERT',
      isVerified: true,
      verifiedAt: new Date(),
      points: 2100,
      tasksCompleted: 22,
      tasksValidated: 20,
      rating: 4.8,
      lumenBalance: 340,
      skills: ['Character Design', 'Environment Design', 'Color Grading'],
      languages: ['Français', 'English', 'Español'],
    },
  })

  const screenwriter = await prisma.user.upsert({
    where: { email: 'scenariste@lumiere.film' },
    update: {},
    create: {
      email: 'scenariste@lumiere.film',
      passwordHash: pwUser,
      displayName: 'Marc Scénario',
      role: 'SCREENWRITER',
      level: 'PRO',
      isVerified: true,
      verifiedAt: new Date(),
      points: 500,
      tasksCompleted: 3,
      tasksValidated: 2,
      rating: 4.2,
      lumenBalance: 80,
      skills: ['Écriture Scénario', 'Dialogue', 'Worldbuilding'],
      languages: ['Français'],
    },
  })

  const stunt = await prisma.user.upsert({
    where: { email: 'stunt@lumiere.film' },
    update: {},
    create: {
      email: 'stunt@lumiere.film',
      passwordHash: pwUser,
      displayName: 'Léa Mouvement',
      role: 'STUNT_PERFORMER',
      level: 'PRO',
      isVerified: true,
      verifiedAt: new Date(),
      points: 600,
      tasksCompleted: 5,
      tasksValidated: 5,
      rating: 4.9,
      lumenBalance: 200,
      skills: ['Motion Capture', 'Stunt Coordination', 'Dance'],
      languages: ['Français', 'English'],
    },
  })

  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@lumiere.film' },
    update: {},
    create: {
      email: 'viewer@lumiere.film',
      passwordHash: pwUser,
      displayName: 'Paul Spectateur',
      role: 'VIEWER',
      level: 'ROOKIE',
      isVerified: true,
      verifiedAt: new Date(),
      points: 50,
      lumenBalance: 10,
      skills: [],
      languages: ['Français'],
    },
  })

  const rookie1 = await prisma.user.upsert({
    where: { email: 'nouveau@lumiere.film' },
    update: {},
    create: {
      email: 'nouveau@lumiere.film',
      passwordHash: pwUser,
      displayName: 'Emma Débutante',
      role: 'CONTRIBUTOR',
      level: 'ROOKIE',
      isVerified: false,
      points: 0,
      lumenBalance: 0,
      skills: ['Prompt Engineering'],
      languages: ['Français', 'English'],
    },
  })

  const rookie2 = await prisma.user.upsert({
    where: { email: 'thomas@lumiere.film' },
    update: {},
    create: {
      email: 'thomas@lumiere.film',
      passwordHash: pwUser,
      displayName: 'Thomas Pixel',
      role: 'CONTRIBUTOR',
      level: 'ROOKIE',
      isVerified: true,
      verifiedAt: new Date(),
      points: 150,
      tasksCompleted: 2,
      tasksValidated: 1,
      rating: 3.8,
      lumenBalance: 25,
      skills: ['Image Generation', 'Compositing'],
      languages: ['Français'],
    },
  })

  const expert1 = await prisma.user.upsert({
    where: { email: 'expert@lumiere.film' },
    update: {},
    create: {
      email: 'expert@lumiere.film',
      passwordHash: pwUser,
      displayName: 'Yuki Tanaka',
      role: 'CONTRIBUTOR',
      level: 'EXPERT',
      isVerified: true,
      verifiedAt: new Date(),
      points: 3500,
      tasksCompleted: 35,
      tasksValidated: 33,
      rating: 4.9,
      lumenBalance: 800,
      skills: ['VFX / Compositing', 'Sound Design', 'Color Grading', 'QA Review'],
      languages: ['Français', 'English', '日本語'],
    },
  })

  const vip1 = await prisma.user.upsert({
    where: { email: 'vip@lumiere.film' },
    update: {},
    create: {
      email: 'vip@lumiere.film',
      passwordHash: pwUser,
      displayName: 'Alexandre Lumens',
      role: 'CONTRIBUTOR',
      level: 'VIP',
      isVerified: true,
      verifiedAt: new Date(),
      points: 10000,
      tasksCompleted: 85,
      tasksValidated: 82,
      rating: 4.95,
      lumenBalance: 2500,
      skills: ['Prompt Engineering', 'Image Generation', 'Character Design', 'VFX / Compositing', 'Direction Artistique'],
      languages: ['Français', 'English', 'Deutsch'],
    },
  })

  console.log('✅ 10 utilisateurs créés')

  // =============================================
  // FILM 1: Exodus — La Traversée
  // =============================================
  const film1 = await prisma.film.upsert({
    where: { slug: 'exodus-la-traversee' },
    update: {},
    create: {
      title: 'Exodus — La Traversée',
      slug: 'exodus-la-traversee',
      description: "L'histoire épique de la libération du peuple hébreu d'Égypte, réimaginée avec l'intelligence artificielle.",
      synopsis: "Dans une Égypte antique somptueuse et mystérieuse, Moïse — fils adopté du Pharaon — découvre ses origines hébraïques. Brisé par cette révélation, il entame un voyage intérieur qui le mènera à affronter le dieu-roi Ramsès II, son frère de sang. Un film épique sur la liberté, la foi, et le sacrifice, entièrement produit grâce à l'intelligence artificielle collaborative.",
      genre: 'Historique',
      catalog: 'BIBLE',
      status: 'IN_PRODUCTION',
      isPublic: true,
      coverImageUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200&h=600&fit=crop',
      estimatedBudget: 50000,
      totalTasks: 0,
      completedTasks: 0,
      progressPct: 0,
    },
  })

  const phases1 = await prisma.filmPhase.createManyAndReturn({
    data: [
      { filmId: film1.id, phaseName: 'SCRIPT', phaseOrder: 1, status: 'COMPLETED' },
      { filmId: film1.id, phaseName: 'STORYBOARD', phaseOrder: 2, status: 'ACTIVE' },
      { filmId: film1.id, phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
      { filmId: film1.id, phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
      { filmId: film1.id, phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
      { filmId: film1.id, phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
      { filmId: film1.id, phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
      { filmId: film1.id, phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
      { filmId: film1.id, phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
      { filmId: film1.id, phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
    ],
  })

  const scriptPhase1 = phases1.find((p: { phaseName: string }) => p.phaseName === 'SCRIPT')!
  const storyboardPhase1 = phases1.find((p: { phaseName: string }) => p.phaseName === 'STORYBOARD')!
  const designPhase1 = phases1.find((p: { phaseName: string }) => p.phaseName === 'DESIGN')!

  // Tasks Film 1
  const tasks1Data = [
    {
      filmId: film1.id, phaseId: scriptPhase1.id,
      title: 'Écriture Acte I — La Révélation',
      descriptionMd: 'Écrire les prompts détaillés pour les 12 premières scènes du film.',
      instructionsMd: 'Chaque prompt : lieu, éclairage, angle caméra, expressions, ambiance. 12 prompts numérotés.',
      type: 'PROMPT_WRITING', difficulty: 'MEDIUM', priceEuros: 100, status: 'VALIDATED', requiredLevel: 'ROOKIE',
      claimedById: contributor.id, claimedAt: new Date('2025-12-01'), validatedAt: new Date('2025-12-05'),
    },
    {
      filmId: film1.id, phaseId: scriptPhase1.id,
      title: "Écriture Acte II — L'Exode",
      descriptionMd: 'Prompts pour les scènes du grand exode : mer qui se sépare, traversée du désert, dix plaies.',
      instructionsMd: 'Focus sur la grandiosité visuelle. 15 prompts minimum.',
      type: 'PROMPT_WRITING', difficulty: 'HARD', priceEuros: 100, status: 'VALIDATED', requiredLevel: 'ROOKIE',
      claimedById: vip1.id, claimedAt: new Date('2025-12-02'), validatedAt: new Date('2025-12-08'),
    },
    {
      filmId: film1.id, phaseId: storyboardPhase1.id,
      title: 'Storyboard Scène 1 — Le Palais du Pharaon',
      descriptionMd: "Créer les images storyboard de la scène d'ouverture. 8 cases attendues.",
      instructionsMd: "Style : réaliste, grandiose, lumière dorée. Résolution min 1920x1080.",
      type: 'IMAGE_GEN', difficulty: 'MEDIUM', priceEuros: 100, status: 'CLAIMED', requiredLevel: 'ROOKIE',
      claimedById: artist.id, claimedAt: new Date('2026-01-15'),
    },
    {
      filmId: film1.id, phaseId: storyboardPhase1.id,
      title: 'Storyboard Scène 7 — Le Buisson Ardent',
      descriptionMd: 'Séquence mystique. Moïse face au buisson. 10 cases.',
      instructionsMd: "Ambiance : mystérieuse, sacrée, lumière surnaturelle. Or et orange.",
      type: 'IMAGE_GEN', difficulty: 'HARD', priceEuros: 100, status: 'AVAILABLE', requiredLevel: 'PRO',
    },
    {
      filmId: film1.id, phaseId: storyboardPhase1.id,
      title: 'Storyboard Scène 15 — La Séparation de la Mer Rouge',
      descriptionMd: "LA scène emblématique. Les eaux se séparent. Spectaculaire et épique.",
      instructionsMd: "Murs d'eau 30m. Poissons et coraux visibles. 12 cases.",
      type: 'IMAGE_GEN', difficulty: 'EXPERT', priceEuros: 500, status: 'AVAILABLE', requiredLevel: 'EXPERT',
    },
    {
      filmId: film1.id, phaseId: designPhase1.id,
      title: 'Character Design — Moïse',
      descriptionMd: 'Design final de Moïse. 5 vues. Avec et sans manteau.',
      instructionsMd: 'Style : réalisme cinéma. ~40 ans, barbe naissante, regard déterminé.',
      type: 'CHARACTER_DESIGN', difficulty: 'EXPERT', priceEuros: 500, status: 'LOCKED', requiredLevel: 'EXPERT',
    },
    {
      filmId: film1.id, phaseId: designPhase1.id,
      title: 'Character Design — Ramsès II',
      descriptionMd: 'Design du Pharaon. Majestueux, intimidant, double couronne égyptienne.',
      instructionsMd: "Vêtements royaux dorés. Expression arrogante avec touche d'humanité.",
      type: 'CHARACTER_DESIGN', difficulty: 'EXPERT', priceEuros: 500, status: 'LOCKED', requiredLevel: 'EXPERT',
    },
    {
      filmId: film1.id, phaseId: storyboardPhase1.id,
      title: 'Vérification Continuité — Acte I',
      descriptionMd: "Vérifier la continuité visuelle scènes 1-12. Costumes, décors, éclairage.",
      instructionsMd: "Utiliser la checklist. Signaler chaque incohérence avec proposition.",
      type: 'CONTINUITY_CHECK', difficulty: 'MEDIUM', priceEuros: 50, status: 'AVAILABLE', requiredLevel: 'ROOKIE',
    },
    {
      filmId: film1.id, phaseId: storyboardPhase1.id,
      title: 'Traduction Sous-titres EN → FR',
      descriptionMd: "Traduire les 120 sous-titres anglais de l'Acte I en français.",
      instructionsMd: "Fichier .SRT fourni. Conserver timecodes. Max 2 lignes / 5 sec. Langue soutenue.",
      type: 'TRANSLATION', difficulty: 'EASY', priceEuros: 50, status: 'AVAILABLE', requiredLevel: 'ROOKIE',
    },
  ]

  for (const task of tasks1Data) {
    await prisma.task.create({ data: task })
  }

  // =============================================
  // FILM 2: Neon Babylon
  // =============================================
  const film2 = await prisma.film.upsert({
    where: { slug: 'neon-babylon' },
    update: {},
    create: {
      title: 'Neon Babylon',
      slug: 'neon-babylon',
      description: "Un thriller cyberpunk néo-noir dans une mégapole futuriste corrompue.",
      synopsis: "2087. New Babylon : ultra-riches vs sous-sols neon. Zara, hackeuse de génie, pénètre le plus grand secret d'une corporation. Traquée, elle choisit entre survie et humanité.",
      genre: 'Science-Fiction',
      catalog: 'LUMIERE',
      status: 'PRE_PRODUCTION',
      isPublic: true,
      coverImageUrl: 'https://images.unsplash.com/photo-1514905552197-0610a4d8fd73?w=1200&h=600&fit=crop',
      estimatedBudget: 80000,
      totalTasks: 0,
      completedTasks: 0,
      progressPct: 0,
    },
  })

  const phases2 = await prisma.filmPhase.createManyAndReturn({
    data: [
      { filmId: film2.id, phaseName: 'SCRIPT', phaseOrder: 1, status: 'ACTIVE' },
      { filmId: film2.id, phaseName: 'STORYBOARD', phaseOrder: 2, status: 'LOCKED' },
      { filmId: film2.id, phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
      { filmId: film2.id, phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
      { filmId: film2.id, phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
      { filmId: film2.id, phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
      { filmId: film2.id, phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
      { filmId: film2.id, phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
      { filmId: film2.id, phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
      { filmId: film2.id, phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
    ],
  })

  const scriptPhase2 = phases2.find((p: { phaseName: string }) => p.phaseName === 'SCRIPT')!

  const tasks2Data = [
    {
      filmId: film2.id, phaseId: scriptPhase2.id,
      title: 'Worldbuilding — Lore de New Babylon',
      descriptionMd: "Créer la bible du monde. Histoire, factions, technologie, économie, culture.",
      instructionsMd: "2000-5000 mots. Sections : Histoire, Factions (5+), Technologie, Économie, Argot local.",
      type: 'PROMPT_WRITING', difficulty: 'HARD', priceEuros: 100, status: 'AVAILABLE', requiredLevel: 'PRO',
    },
    {
      filmId: film2.id, phaseId: scriptPhase2.id,
      title: 'Design Concept — Personnage Zara',
      descriptionMd: "Esthétique visuelle de Zara. Hackeuse, ~25 ans, style cyberpunk.",
      instructionsMd: "3 variations (infiltration, combat, quotidien). Implants cybernétiques. 9 images total.",
      type: 'CHARACTER_DESIGN', difficulty: 'EXPERT', priceEuros: 500, status: 'AVAILABLE', requiredLevel: 'EXPERT',
    },
    {
      filmId: film2.id, phaseId: scriptPhase2.id,
      title: 'Prompts Environnement — Les Sous-Sols',
      descriptionMd: "20 prompts pour les zones souterraines. Taudis, marchés noirs, tunnels.",
      instructionsMd: "Sombre, humide, neon violet/vert, câbles, hologrammes défaillants.",
      type: 'ENV_DESIGN', difficulty: 'MEDIUM', priceEuros: 100, status: 'CLAIMED', requiredLevel: 'ROOKIE',
      claimedById: rookie2.id, claimedAt: new Date('2026-02-10'),
    },
    {
      filmId: film2.id, phaseId: scriptPhase2.id,
      title: 'Dialogues — Scènes 1-10',
      descriptionMd: "Dialogues des 10 premières scènes. Ton : cynique, urbain, argot cyberpunk.",
      instructionsMd: "Slang futuriste + glossaire. Dialogues courts et percutants. Sous-texte important.",
      type: 'DIALOGUE_EDIT', difficulty: 'HARD', priceEuros: 100, status: 'AVAILABLE', requiredLevel: 'PRO',
    },
    {
      filmId: film2.id, phaseId: scriptPhase2.id,
      title: 'QA Review — Cohérence du Lore',
      descriptionMd: "Vérifier la cohérence entre descriptions, dialogues et designs vs bible du monde.",
      instructionsMd: "Rapport de bugs : page, type d'incohérence, correction proposée.",
      type: 'QA_REVIEW', difficulty: 'EASY', priceEuros: 50, status: 'AVAILABLE', requiredLevel: 'ROOKIE',
    },
  ]

  for (const task of tasks2Data) {
    await prisma.task.create({ data: task })
  }

  // =============================================
  // FILM 3: Le Dernier Jardin
  // =============================================
  const film3 = await prisma.film.upsert({
    where: { slug: 'le-dernier-jardin' },
    update: {},
    create: {
      title: 'Le Dernier Jardin',
      slug: 'le-dernier-jardin',
      description: "Un conte poétique et écologique. Dans un monde ravagé, un enfant découvre le dernier jardin vivant.",
      synopsis: "2150. La Terre est devenue un désert de béton. Lila, 10 ans, vit dans une cité souterraine. Un jour, en explorant un tunnel condamné, elle découvre un jardin miraculeux. Des fleurs, des arbres, de l'eau pure. Poursuivie par ceux qui veulent exploiter cette ressource, elle devra protéger le dernier espoir de l'humanité.",
      genre: 'Animation',
      catalog: 'LUMIERE',
      status: 'DRAFT',
      isPublic: true,
      coverImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop',
      estimatedBudget: 35000,
      totalTasks: 0,
      completedTasks: 0,
      progressPct: 0,
    },
  })

  const phases3 = await prisma.filmPhase.createManyAndReturn({
    data: [
      { filmId: film3.id, phaseName: 'SCRIPT', phaseOrder: 1, status: 'ACTIVE' },
      { filmId: film3.id, phaseName: 'STORYBOARD', phaseOrder: 2, status: 'LOCKED' },
      { filmId: film3.id, phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
      { filmId: film3.id, phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
      { filmId: film3.id, phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
      { filmId: film3.id, phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
      { filmId: film3.id, phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
      { filmId: film3.id, phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
      { filmId: film3.id, phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
      { filmId: film3.id, phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
    ],
  })

  const scriptPhase3 = phases3.find((p: { phaseName: string }) => p.phaseName === 'SCRIPT')!

  const tasks3Data = [
    {
      filmId: film3.id, phaseId: scriptPhase3.id,
      title: 'Écriture complète du scénario',
      descriptionMd: "Rédiger le scénario complet du Dernier Jardin. 25-30 pages.",
      instructionsMd: "Format : scénario classique. Acte I (découverte), Acte II (menace), Acte III (résolution). Ton poétique.",
      type: 'PROMPT_WRITING', difficulty: 'HARD', priceEuros: 200, status: 'AVAILABLE', requiredLevel: 'PRO',
    },
    {
      filmId: film3.id, phaseId: scriptPhase3.id,
      title: 'Concept Art — Lila (personnage principal)',
      descriptionMd: "Design de Lila, 10 ans. Style animation stylisée (Ghibli meets IA).",
      instructionsMd: "3 expressions (curiosité, peur, émerveillement). Vêtements recyclés, cheveux sauvages.",
      type: 'CHARACTER_DESIGN', difficulty: 'MEDIUM', priceEuros: 100, status: 'AVAILABLE', requiredLevel: 'ROOKIE',
    },
    {
      filmId: film3.id, phaseId: scriptPhase3.id,
      title: 'Concept Art — Le Jardin',
      descriptionMd: "Visualiser le jardin secret : luxuriant, lumineux, contrastant avec le monde gris.",
      instructionsMd: "5 vues : entrée, lac central, serre principale, arbre ancestral, vue aérienne.",
      type: 'ENV_DESIGN', difficulty: 'MEDIUM', priceEuros: 100, status: 'AVAILABLE', requiredLevel: 'ROOKIE',
    },
  ]

  for (const task of tasks3Data) {
    await prisma.task.create({ data: task })
  }

  // =============================================
  // UPDATE FILM STATS
  // =============================================
  for (const film of [film1, film2, film3]) {
    const total = await prisma.task.count({ where: { filmId: film.id } })
    const validated = await prisma.task.count({ where: { filmId: film.id, status: 'VALIDATED' } })
    await prisma.film.update({
      where: { id: film.id },
      data: {
        totalTasks: total,
        completedTasks: validated,
        progressPct: total > 0 ? Math.round((validated / total) * 100) : 0,
      },
    })
  }
  console.log('✅ 3 films créés avec tâches')

  // =============================================
  // SUBMISSIONS (some completed tasks)
  // =============================================
  const validatedTasks = await prisma.task.findMany({
    where: { status: 'VALIDATED' },
    select: { id: true, filmId: true, claimedById: true },
  })

  for (const task of validatedTasks) {
    if (!task.claimedById) continue
    await prisma.taskSubmission.create({
      data: {
        taskId: task.id,
        userId: task.claimedById,
        notes: 'Tâche complétée avec succès. Fichiers livrés conformément aux instructions.',
        aiScore: 85 + Math.random() * 15,
        aiFeedback: 'Excellent travail. Qualité conforme aux attentes. Cohérence visuelle respectée.',
        status: 'HUMAN_APPROVED',
        humanReviewerId: admin.id,
        humanFeedback: 'Validé. Très bon travail.',
      },
    })
  }

  // Submission for CLAIMED task (pending AI review)
  const claimedTask = await prisma.task.findFirst({ where: { status: 'CLAIMED', claimedById: artist.id } })
  if (claimedTask) {
    await prisma.taskSubmission.create({
      data: {
        taskId: claimedTask.id,
        userId: artist.id,
        notes: 'Voici mes 8 cases de storyboard pour la scène du palais.',
        aiScore: 78,
        aiFeedback: 'Bonne qualité globale. Quelques ajustements de perspective suggérés.',
        status: 'AI_FLAGGED',
      },
    })
  }
  console.log('✅ Submissions créées')

  // =============================================
  // PAYMENTS (for validated tasks)
  // =============================================
  const validatedTasksFull = await prisma.task.findMany({
    where: { status: 'VALIDATED' },
    select: { id: true, priceEuros: true, claimedById: true },
  })

  for (const task of validatedTasksFull) {
    if (!task.claimedById) continue
    await prisma.payment.upsert({
      where: { taskId: task.id },
      create: {
        userId: task.claimedById,
        taskId: task.id,
        amountEur: task.priceEuros,
        method: 'STRIPE',
        status: Math.random() > 0.5 ? 'COMPLETED' : 'PENDING',
        paidAt: Math.random() > 0.5 ? new Date() : null,
      },
      update: {},
    })
  }
  console.log('✅ Paiements créés')

  // =============================================
  // LUMEN TRANSACTIONS
  // =============================================
  const lumenTxs = [
    { userId: contributor.id, amount: 100, type: 'PURCHASE', description: 'Achat de 100 Lumens' },
    { userId: contributor.id, amount: 10, type: 'TASK_REWARD', description: 'Récompense tâche — Écriture Acte I' },
    { userId: contributor.id, amount: 10, type: 'TASK_REWARD', description: 'Récompense tâche — Storyboard' },
    { userId: artist.id, amount: 200, type: 'PURCHASE', description: 'Achat de 200 Lumens' },
    { userId: artist.id, amount: 10, type: 'TASK_REWARD', description: 'Récompense tâche' },
    { userId: vip1.id, amount: 2000, type: 'PURCHASE', description: 'Achat de 2000 Lumens' },
    { userId: vip1.id, amount: 500, type: 'BONUS', description: 'Bonus VIP — Top contributeur du mois' },
    { userId: viewer.id, amount: 10, type: 'BONUS', description: 'Bonus bienvenue' },
    { userId: expert1.id, amount: 500, type: 'PURCHASE', description: 'Achat de 500 Lumens' },
    { userId: expert1.id, amount: 300, type: 'TASK_REWARD', description: 'Récompenses tâches cumulées' },
  ]

  for (const tx of lumenTxs) {
    await prisma.lumenTransaction.create({ data: tx as any })
  }
  console.log('✅ Transactions Lumens créées')

  // =============================================
  // ACHIEVEMENTS
  // =============================================
  const achievements = [
    { userId: admin.id, achievementType: 'Première Lumière', metadata: { note: 'Premier admin' } },
    { userId: contributor.id, achievementType: 'Première Tâche', metadata: { note: 'Première tâche complétée' } },
    { userId: artist.id, achievementType: 'Artiste en Herbe', metadata: { note: '10 tâches design complétées' } },
    { userId: artist.id, achievementType: 'Perfectionniste', metadata: { note: 'Rating > 4.5' } },
    { userId: vip1.id, achievementType: 'Première Lumière', metadata: {} },
    { userId: vip1.id, achievementType: 'Centurion', metadata: { note: '100 tâches complétées' } },
    { userId: vip1.id, achievementType: 'Légende Dorée', metadata: { note: 'Niveau VIP atteint' } },
    { userId: expert1.id, achievementType: 'Expert Reconnu', metadata: { note: 'Niveau Expert atteint' } },
    { userId: stunt.id, achievementType: 'Première Cascade', metadata: { note: 'Première capture motion' } },
  ]

  for (const ach of achievements) {
    await prisma.userAchievement.create({ data: ach as any })
  }
  console.log('✅ Achievements créés')

  // =============================================
  // SCREENPLAYS
  // =============================================
  await prisma.screenplay.createMany({
    data: [
      {
        userId: screenwriter.id,
        title: 'Les Ombres de Marrakech',
        logline: "Un détective français d'origine marocaine retourne à Marrakech pour enquêter sur des disparitions liées à un réseau de contrebande d'art.",
        genre: 'Thriller',
        aiScore: 72,
        aiFeedback: 'Structure solide, personnages bien définis. Le twist du 3ème acte mérite plus de build-up.',
        modificationTolerance: 30,
        revenueShareBps: 500,
        status: 'SUBMITTED',
      },
      {
        userId: screenwriter.id,
        title: 'Quantique',
        logline: "Une physicienne découvre que la réalité est une simulation et qu'elle peut la modifier, mais chaque changement a un prix.",
        genre: 'Science-Fiction',
        aiScore: 88,
        aiFeedback: 'Excellent concept. Dialogues percutants. Le dilemme moral est très bien construit.',
        modificationTolerance: 15,
        revenueShareBps: 800,
        status: 'ACCEPTED',
      },
    ],
  })
  console.log('✅ Scénarios créés')

  // =============================================
  // SUBSCRIPTIONS
  // =============================================
  await prisma.subscription.createMany({
    data: [
      { userId: viewer.id, plan: 'FREE', status: 'active' },
      { userId: vip1.id, plan: 'BUSINESS', status: 'active', expiresAt: new Date('2027-01-01') },
      { userId: artist.id, plan: 'PRO', status: 'active', expiresAt: new Date('2026-12-01') },
      { userId: expert1.id, plan: 'STARTER', status: 'active', expiresAt: new Date('2026-12-01') },
      { userId: contributor.id, plan: 'FREE', status: 'active' },
    ],
  })
  console.log('✅ Abonnements créés (FREE, STARTER, PRO, BUSINESS)')

  // =============================================
  // NOTIFICATIONS
  // =============================================
  const notifs = [
    { userId: contributor.id, type: 'TASK_VALIDATED', title: 'Tâche validée', body: 'Votre soumission "Écriture Acte I" a été approuvée. +100 points, +10 Lumens.', href: '/tasks', read: true },
    { userId: contributor.id, type: 'PAYMENT_RECEIVED', title: 'Paiement en cours', body: 'Votre paiement de 100,00€ est en cours de traitement.', href: '/profile/payments', read: false },
    { userId: artist.id, type: 'SUBMISSION_REVIEWED', title: 'Revue IA terminée', body: 'Score IA : 78/100. En attente de revue humaine.', href: '/tasks', read: false },
    { userId: rookie1.id, type: 'SYSTEM', title: 'Bienvenue sur Lumière!', body: 'Votre compte a été créé. Vérifiez votre email pour accéder à toutes les fonctionnalités.', href: '/dashboard', read: false },
    { userId: vip1.id, type: 'LEVEL_UP', title: 'Niveau VIP!', body: 'Félicitations ! Vous avez atteint le niveau VIP. Accès à toutes les tâches.', href: '/profile', read: true },
    { userId: expert1.id, type: 'NEW_TASK_AVAILABLE', title: 'Nouvelle tâche disponible', body: 'Une tâche EXPERT est disponible : "Storyboard Mer Rouge".', href: '/tasks', read: false },
  ]

  for (const n of notifs) {
    await prisma.notification.create({ data: n as any })
  }
  console.log('✅ Notifications créées')

  // =============================================
  // ADMIN TODOS
  // =============================================
  const todos = [
    { title: 'Configurer Stripe Connect', description: 'Créer compte Stripe et configurer les webhooks.', priority: 'HIGH' },
    { title: 'Intégrer Resend pour les emails', description: 'API key + templates de base.', priority: 'HIGH' },
    { title: 'Remplacer mock AI par Claude API', description: 'Utiliser claude-sonnet-4-6 pour la revue automatique.', priority: 'MEDIUM' },
    { title: 'Ajouter OAuth Google + GitHub', description: 'Providers NextAuth additionnels.', priority: 'MEDIUM' },
    { title: 'Créer page CGV/CGU', description: 'Faire rédiger par un avocat.', priority: 'HIGH', dueAt: new Date('2026-04-01') },
    { title: 'Tourner vidéo démo', description: 'Court-métrage démo de 2 min pour showcaser la plateforme.', priority: 'LOW' },
    { title: 'Configurer Sentry', description: 'Monitoring des erreurs en production.', priority: 'MEDIUM' },
    { title: 'Beta test — recruter 50 testeurs', description: 'Lancer appel sur LinkedIn et communautés IA.', priority: 'HIGH', dueAt: new Date('2026-05-01') },
  ]

  for (const todo of todos) {
    await prisma.adminTodo.create({ data: todo as any })
  }
  console.log('✅ Admin TODOs créés')

  // =============================================
  // FILM VOTES & BACKERS
  // =============================================
  await prisma.filmVote.createMany({
    data: [
      { filmId: film1.id, userId: viewer.id, voteType: 'UPVOTE' },
      { filmId: film1.id, userId: contributor.id, voteType: 'UPVOTE' },
      { filmId: film1.id, userId: artist.id, voteType: 'UPVOTE' },
      { filmId: film2.id, userId: viewer.id, voteType: 'UPVOTE' },
      { filmId: film2.id, userId: expert1.id, voteType: 'UPVOTE' },
      { filmId: film3.id, userId: screenwriter.id, voteType: 'UPVOTE' },
    ],
  })

  await prisma.filmBacker.createMany({
    data: [
      { filmId: film1.id, userId: vip1.id, amountInvested: 1000, revenueShareBps: 200, perks: ['Crédit au générique', 'Accès early screening'] },
      { filmId: film1.id, userId: viewer.id, amountInvested: 50, revenueShareBps: 10, perks: ['Crédit au générique'] },
      { filmId: film2.id, userId: vip1.id, amountInvested: 2000, revenueShareBps: 400, perks: ['Crédit au générique', 'NFT exclusif', 'Accès early screening'] },
    ],
  })
  console.log('✅ Votes et Backers créés')

  // =============================================
  // TASK COMMENTS
  // =============================================
  const availableTask = await prisma.task.findFirst({ where: { status: 'AVAILABLE' } })
  if (availableTask) {
    await prisma.taskComment.createMany({
      data: [
        { taskId: availableTask.id, userId: contributor.id, content: 'Question : le format des images est bien 16:9 ou on peut aussi faire du 2.39:1 ?', createdAt: new Date('2026-02-01') },
        { taskId: availableTask.id, userId: admin.id, content: 'Bonne question ! Le 2.39:1 serait idéal pour donner un look cinéma. Go pour ça.', createdAt: new Date('2026-02-02') },
      ],
    })
  }
  console.log('✅ Commentaires créés')

  // =============================================
  // PUBLIC FUNDING (AIDES PUBLIQUES)
  // =============================================
  await prisma.publicFunding.create({
    data: {
      name: 'Bourse French Tech Émergence',
      organism: 'Bpifrance',
      type: 'SUBVENTION',
      description: "Aide de 30 000€ pour les startups innovantes en phase d'amorçage. Financement non dilutif.",
      eligibility: "Entreprise < 1 an, projet innovant, équipe de 1-3 fondateurs. Dépôt en ligne sur bpifrance.fr.",
      maxAmount: 30000,
      status: 'ELIGIBLE',
      priority: 10,
      preCompany: false,
      postCompany: true,
      applicationUrl: 'https://bfrenchtech.bpifrance.fr',
      notes: "Très bonne opportunité. Délai de réponse ~3 mois.",
      steps: {
        create: [
          { title: 'Création du compte Bpifrance', order: 1, documents: ['KBIS', 'RIB'] },
          { title: 'Rédaction du dossier de candidature', order: 2, documents: ['Business Plan', 'Prévisionnel 3 ans'] },
          { title: 'Préparation du pitch deck', order: 3, documents: ['Pitch deck 12 slides'] },
          { title: 'Dépôt du dossier en ligne', order: 4 },
          { title: 'Passage en comité de sélection', order: 5 },
        ],
      },
    },
  })

  await prisma.publicFunding.create({
    data: {
      name: 'Aide aux Nouvelles Technologies en Production (NTP)',
      organism: 'CNC',
      type: 'SUBVENTION',
      description: "Le CNC soutient les projets utilisant des technologies innovantes pour la production audiovisuelle.",
      eligibility: "Société de production audiovisuelle immatriculée en France. Projet avec composante technologique innovante.",
      maxAmount: 50000,
      status: 'NOT_STARTED',
      priority: 9,
      preCompany: false,
      postCompany: true,
      applicationUrl: 'https://www.cnc.fr/professionnels/aides-et-financements',
      steps: {
        create: [
          { title: "Vérifier l'éligibilité détaillée", order: 1, documents: ['Grille CNC'] },
          { title: 'Préparer le dossier technique', order: 2, documents: ['Note technique', 'Devis détaillé'] },
          { title: "Rédiger la note d'intention", order: 3, documents: ["Note d'intention artistique"] },
          { title: 'Soumettre le dossier', order: 4 },
          { title: 'Présentation au comité', order: 5 },
        ],
      },
    },
  })

  await prisma.publicFunding.create({
    data: {
      name: "Crédit d'Impôt Recherche (CIR)",
      organism: 'Ministère de la Recherche',
      type: 'CREDIT_IMPOT',
      description: "30% des dépenses de R&D éligibles remboursées. L'IA appliquée au cinéma peut qualifier.",
      eligibility: "Toute entreprise française menant des activités de R&D. Dépenses : salaires chercheurs, sous-traitance.",
      maxAmount: 100000,
      status: 'ELIGIBLE',
      priority: 8,
      preCompany: false,
      postCompany: true,
      notes: "Potentiellement le plus rentable. Besoin d'un consultant CIR.",
      steps: {
        create: [
          { title: 'Identifier les activités R&D éligibles', order: 1 },
          { title: 'Documenter les travaux de recherche', order: 2, documents: ['Journal de bord R&D'] },
          { title: 'Calculer les dépenses éligibles', order: 3, documents: ['Comptabilité analytique'] },
          { title: 'Préparer le dossier justificatif', order: 4, documents: ['Dossier technique CIR'] },
          { title: 'Déclarer sur CERFA 2069-A', order: 5, documents: ['CERFA 2069-A'] },
        ],
      },
    },
  })

  await prisma.publicFunding.create({
    data: {
      name: 'Concours i-Nov',
      organism: 'Bpifrance / ADEME',
      type: 'CONCOURS',
      description: "Concours d'innovation pour les startups deeptech. Subvention jusqu'à 500K€.",
      eligibility: "Startup < 5 ans, projet deeptech, TRL 5-8. Candidature par vague thématique.",
      maxAmount: 500000,
      status: 'NOT_STARTED',
      priority: 7,
      preCompany: false,
      postCompany: true,
      steps: {
        create: [
          { title: 'Surveiller les vagues thématiques', order: 1 },
          { title: "Vérifier l'adéquation du projet", order: 2 },
          { title: 'Constituer le dossier complet', order: 3, documents: ['Dossier i-Nov', 'Budget prévisionnel'] },
          { title: 'Soumettre avant la date limite', order: 4 },
        ],
      },
    },
  })

  await prisma.publicFunding.create({
    data: {
      name: 'RIAM — Recherche et Innovation en Audiovisuel',
      organism: 'CNC / Bpifrance',
      type: 'SUBVENTION',
      description: "Programme conjoint CNC/Bpifrance pour les projets R&D audiovisuel innovants. IA + cinéma = axe prioritaire.",
      eligibility: "PME/startup audiovisuelle. Projet R&D collaboratif potentiel avec un labo de recherche.",
      maxAmount: 200000,
      status: 'ELIGIBLE',
      priority: 9,
      preCompany: false,
      postCompany: true,
      steps: {
        create: [
          { title: 'Identifier un partenaire labo', order: 1, description: 'INRIA, CNRS, université' },
          { title: 'Rédiger le projet collaboratif', order: 2, documents: ['Description projet', 'Budget'] },
          { title: 'Soumettre le dossier RIAM', order: 3 },
          { title: 'Évaluation par le comité mixte', order: 4 },
        ],
      },
    },
  })

  await prisma.publicFunding.create({
    data: {
      name: 'Statut Jeune Entreprise Innovante (JEI)',
      organism: 'URSSAF / DGFIP',
      type: 'CREDIT_IMPOT',
      description: "Exonérations de charges sociales et fiscales pendant 8 ans pour les entreprises innovantes.",
      eligibility: "Entreprise < 8 ans, < 250 salariés, indépendante, 15% min de dépenses en R&D.",
      maxAmount: 0,
      status: 'NOT_STARTED',
      priority: 6,
      preCompany: false,
      postCompany: true,
      notes: "Exonération charges patronales + IS. Cumulable avec CIR.",
      steps: {
        create: [
          { title: "Vérifier les critères d'éligibilité", order: 1 },
          { title: 'Préparer le rescrit fiscal', order: 2, documents: ['Rescrit JEI'] },
          { title: "Déclarer auprès de l'URSSAF", order: 3 },
        ],
      },
    },
  })

  await prisma.publicFunding.create({
    data: {
      name: "NACRE — Aide à la Création d'Entreprise",
      organism: 'Région / Pôle Emploi',
      type: 'PRET',
      description: "Prêt à taux zéro de 1 000 à 10 000€ pour les créateurs d'entreprise.",
      eligibility: "Demandeur d'emploi ou bénéficiaire RSA créant une entreprise.",
      maxAmount: 10000,
      status: 'NOT_STARTED',
      priority: 4,
      preCompany: true,
      postCompany: false,
      steps: {
        create: [
          { title: 'Contacter Pôle Emploi / Région', order: 1 },
          { title: 'Monter le dossier de prêt', order: 2, documents: ['Business Plan', 'Prévisionnel'] },
          { title: 'Entretien avec le comité', order: 3 },
        ],
      },
    },
  })

  await prisma.publicFunding.create({
    data: {
      name: 'ACRE — Exonération Charges Sociales',
      organism: 'URSSAF',
      type: 'SUBVENTION',
      description: "Exonération partielle de charges sociales pendant 1 an pour les créateurs d'entreprise.",
      eligibility: "Demandeur d'emploi, < 26 ans, bénéficiaire RSA. Automatique sous conditions.",
      maxAmount: 0,
      status: 'ELIGIBLE',
      priority: 5,
      preCompany: true,
      postCompany: false,
      steps: {
        create: [
          { title: 'Vérifier les conditions', order: 1 },
          { title: 'Déclarer lors de la création', order: 2, documents: ['Formulaire ACRE'] },
        ],
      },
    },
  })

  console.log('✅ Aides publiques créées (8 aides avec étapes)')

  // =============================================
  // V3 — CATALOG FILMS (STREAMING)
  // =============================================
  const catalogFilm1 = await prisma.catalogFilm.upsert({
    where: { slug: 'ombres-de-tokyo' },
    update: {},
    create: {
      title: 'Ombres de Tokyo',
      slug: 'ombres-de-tokyo',
      synopsis: "Un photographe français perdu dans les ruelles de Shinjuku découvre un monde parallèle à travers son objectif.",
      genre: 'Thriller',
      videoUrl: 'https://example.com/videos/ombres-de-tokyo.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=450&fit=crop',
      duration: 720,
      status: 'LIVE',
      submittedById: artist.id,
      viewCount: 3420,
      monthlyViews: 1280,
      revenueSharePct: 50,
      isContest: true,
      featured: true,
      tags: ['thriller', 'japon', 'photographie', 'mystere'],
      year: 2026,
      language: 'fr',
    },
  })

  const catalogFilm2 = await prisma.catalogFilm.upsert({
    where: { slug: 'reve-electrique' },
    update: {},
    create: {
      title: 'Rêve Électrique',
      slug: 'reve-electrique',
      synopsis: "Dans un futur proche, une IA compositrice crée la symphonie parfaite — mais à quel prix ?",
      genre: 'Science-Fiction',
      videoUrl: 'https://example.com/videos/reve-electrique.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=450&fit=crop',
      duration: 540,
      status: 'LIVE',
      submittedById: vip1.id,
      viewCount: 5890,
      monthlyViews: 2340,
      revenueSharePct: 55,
      isContest: true,
      featured: false,
      tags: ['sci-fi', 'musique', 'ia', 'futur'],
      year: 2026,
      language: 'fr',
    },
  })

  const catalogFilm3 = await prisma.catalogFilm.upsert({
    where: { slug: 'memoires-deau' },
    update: {},
    create: {
      title: "Mémoires d'Eau",
      slug: 'memoires-deau',
      synopsis: "Un documentaire poétique sur les rivières disparues de France, entièrement généré par IA.",
      genre: 'Documentaire',
      thumbnailUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&h=450&fit=crop',
      duration: 960,
      status: 'PENDING',
      submittedById: contributor.id,
      viewCount: 0,
      monthlyViews: 0,
      revenueSharePct: 50,
      isContest: false,
      tags: ['documentaire', 'ecologie', 'france'],
      year: 2026,
      language: 'fr',
    },
  })

  // Contracts for live films
  await prisma.catalogContract.create({
    data: {
      filmId: catalogFilm1.id,
      userId: artist.id,
      terms: '# Contrat de Distribution — Ombres de Tokyo\n\nContrat entre Sophie Visuelle et Lumière...',
      revenueSharePct: 50,
      promotionClause: true,
      exclusivity: false,
      status: 'SIGNED',
      signedAt: new Date('2026-01-15'),
    },
  })

  await prisma.catalogContract.create({
    data: {
      filmId: catalogFilm2.id,
      userId: vip1.id,
      terms: '# Contrat de Distribution — Rêve Électrique\n\nContrat entre Alexandre Lumens et Lumière...',
      revenueSharePct: 55,
      promotionClause: true,
      exclusivity: true,
      exclusivityBonus: 10,
      status: 'SIGNED',
      signedAt: new Date('2026-01-20'),
    },
  })

  // Film views
  const filmViewsData = [
    { filmId: catalogFilm1.id, userId: viewer.id, watchDuration: 600, completionPct: 83.3 },
    { filmId: catalogFilm1.id, userId: contributor.id, watchDuration: 720, completionPct: 100 },
    { filmId: catalogFilm1.id, userId: expert1.id, watchDuration: 450, completionPct: 62.5 },
    { filmId: catalogFilm2.id, userId: viewer.id, watchDuration: 540, completionPct: 100 },
    { filmId: catalogFilm2.id, userId: artist.id, watchDuration: 400, completionPct: 74.1 },
    { filmId: catalogFilm2.id, userId: stunt.id, watchDuration: 540, completionPct: 100 },
  ]
  for (const fv of filmViewsData) {
    await prisma.filmView.create({ data: fv })
  }

  // Creator payouts
  await prisma.creatorPayout.create({
    data: {
      userId: artist.id,
      filmId: catalogFilm1.id,
      month: '2026-01',
      totalViews: 3420,
      platformViews: 12000,
      ratio: 0.285,
      amountEur: 142.50,
      status: 'PAID',
      paidAt: new Date('2026-02-05'),
    },
  })

  await prisma.creatorPayout.create({
    data: {
      userId: vip1.id,
      filmId: catalogFilm2.id,
      month: '2026-01',
      totalViews: 5890,
      platformViews: 12000,
      ratio: 0.491,
      amountEur: 245.50,
      status: 'PAID',
      paidAt: new Date('2026-02-05'),
    },
  })

  await prisma.creatorPayout.create({
    data: {
      userId: artist.id,
      filmId: catalogFilm1.id,
      month: '2026-02',
      totalViews: 1280,
      platformViews: 5000,
      ratio: 0.256,
      amountEur: 128.00,
      status: 'PENDING',
    },
  })

  console.log('✅ Catalogue streaming créé (3 films, contrats, vues, payouts)')

  // =============================================
  // V3 — CREATOR PROFILES & VIDEOS
  // =============================================
  const creatorProfile1 = await prisma.creatorProfile.create({
    data: {
      userId: artist.id,
      stageName: 'SophieViz',
      niche: 'Art & Design',
      style: 'NOFACE',
      bio: 'Artiste digitale spécialisée dans les visuels cinématographiques IA.',
      toneOfVoice: 'Inspirant et calme',
      catchphrases: ['Créez sans limites', 'L\'art n\'a pas de visage'],
      avatarType: 'anime',
      avatarConfig: { color: 'purple', expression: 'mysterious' },
      voiceType: 'synthetic',
      voiceConfig: { pitch: 'medium', speed: 'normal', accent: 'neutral' },
      publishFrequency: '3x_week',
      automationLevel: 'ASSISTED',
      wizardCompleted: true,
    },
  })

  const creatorProfile2 = await prisma.creatorProfile.create({
    data: {
      userId: vip1.id,
      stageName: 'AlexLumens',
      niche: 'Storytelling',
      style: 'HYBRID',
      bio: 'Conteur digital, entre mystery et motivation. 100K+ followers.',
      toneOfVoice: 'Dramatique et captivant',
      catchphrases: ['La vérité est dans les ombres', 'Êtes-vous prêts ?'],
      avatarType: 'realistic',
      avatarConfig: { style: 'cinematic', lighting: 'dramatic' },
      voiceType: 'clone',
      voiceConfig: { model: 'eleven_multilingual_v2', stability: 0.7 },
      publishFrequency: 'daily',
      automationLevel: 'AUTO',
      wizardCompleted: true,
    },
  })

  const creatorProfile3 = await prisma.creatorProfile.create({
    data: {
      userId: expert1.id,
      stageName: 'YukiCreates',
      niche: 'Éducation',
      style: 'NOFACE',
      bio: 'Vulgarisation scientifique et tech en vidéos animées.',
      toneOfVoice: 'Clair et pédagogique',
      catchphrases: ['Expliqué simplement'],
      avatarType: 'cartoon',
      avatarConfig: { color: 'blue', style: 'friendly' },
      voiceType: 'natural',
      publishFrequency: 'weekly',
      automationLevel: 'EXPERT',
      wizardCompleted: true,
    },
  })

  // Generated Videos
  const video1 = await prisma.generatedVideo.create({
    data: {
      profileId: creatorProfile1.id,
      title: 'Comment l\'IA révolutionne le design',
      script: 'L\'intelligence artificielle transforme notre façon de créer...',
      duration: 60,
      status: 'PUBLISHED',
      platforms: ['TIKTOK', 'INSTAGRAM'],
      publishedAt: new Date('2026-02-10'),
      viewCount: 12500,
      likeCount: 890,
      shareCount: 45,
      tokensSpent: 10,
    },
  })

  const video2 = await prisma.generatedVideo.create({
    data: {
      profileId: creatorProfile1.id,
      title: '5 tendances visuelles 2026',
      script: 'Voici les 5 tendances qui vont dominer le design en 2026...',
      duration: 90,
      status: 'READY',
      platforms: ['YOUTUBE', 'TIKTOK'],
      viewCount: 0,
      likeCount: 0,
      shareCount: 0,
      tokensSpent: 15,
    },
  })

  const video3 = await prisma.generatedVideo.create({
    data: {
      profileId: creatorProfile2.id,
      title: 'L\'affaire du manoir abandonné',
      script: 'Ce soir, je vous emmène dans un endroit où personne n\'ose aller...',
      duration: 120,
      status: 'PUBLISHED',
      platforms: ['YOUTUBE', 'TIKTOK', 'INSTAGRAM'],
      publishedAt: new Date('2026-02-15'),
      abTestVariant: 'A',
      abTestGroupId: 'test-001',
      viewCount: 45200,
      likeCount: 3200,
      shareCount: 890,
      tokensSpent: 18,
    },
  })

  const video4 = await prisma.generatedVideo.create({
    data: {
      profileId: creatorProfile2.id,
      title: 'L\'affaire du manoir abandonné (v2)',
      script: 'Imaginez un lieu oublié par le temps...',
      duration: 120,
      status: 'PUBLISHED',
      platforms: ['YOUTUBE', 'TIKTOK', 'INSTAGRAM'],
      publishedAt: new Date('2026-02-15'),
      abTestVariant: 'B',
      abTestGroupId: 'test-001',
      viewCount: 38900,
      likeCount: 2800,
      shareCount: 720,
      tokensSpent: 18,
    },
  })

  await prisma.generatedVideo.create({
    data: {
      profileId: creatorProfile3.id,
      title: 'La physique quantique en 60 secondes',
      script: 'La physique quantique, c\'est pas si compliqué...',
      duration: 60,
      status: 'GENERATING',
      platforms: ['YOUTUBE'],
      viewCount: 0,
      likeCount: 0,
      shareCount: 0,
      tokensSpent: 10,
    },
  })

  // Publish schedules
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 86400000)
  const dayAfter = new Date(now.getTime() + 86400000 * 2)

  await prisma.publishSchedule.createMany({
    data: [
      { videoId: video1.id, platform: 'TIKTOK', scheduledAt: new Date('2026-02-10T14:00:00Z'), jitterMinutes: 12, publishedAt: new Date('2026-02-10T14:12:00Z'), status: 'PUBLISHED' },
      { videoId: video1.id, platform: 'INSTAGRAM', scheduledAt: new Date('2026-02-10T16:00:00Z'), jitterMinutes: -8, publishedAt: new Date('2026-02-10T15:52:00Z'), status: 'PUBLISHED' },
      { videoId: video2.id, platform: 'YOUTUBE', scheduledAt: tomorrow, jitterMinutes: 22, status: 'SCHEDULED' },
      { videoId: video2.id, platform: 'TIKTOK', scheduledAt: dayAfter, jitterMinutes: -15, status: 'SCHEDULED' },
      { videoId: video3.id, platform: 'YOUTUBE', scheduledAt: new Date('2026-02-15T18:00:00Z'), jitterMinutes: 5, publishedAt: new Date('2026-02-15T18:05:00Z'), status: 'PUBLISHED' },
      { videoId: video3.id, platform: 'TIKTOK', scheduledAt: new Date('2026-02-15T20:00:00Z'), jitterMinutes: -20, publishedAt: new Date('2026-02-15T19:40:00Z'), status: 'PUBLISHED' },
    ],
  })

  console.log('✅ Profils créateurs, vidéos et plannings créés')

  // =============================================
  // V3 — SOCIAL ACCOUNTS
  // =============================================
  await prisma.socialAccount.createMany({
    data: [
      { userId: artist.id, platform: 'TIKTOK', handle: '@sophieviz', followersCount: 12500, engagementRate: 4.2, isActive: true, lastSyncAt: new Date() },
      { userId: artist.id, platform: 'INSTAGRAM', handle: '@sophieviz.art', followersCount: 8900, engagementRate: 3.8, isActive: true, lastSyncAt: new Date() },
      { userId: vip1.id, platform: 'YOUTUBE', handle: '@AlexLumens', followersCount: 52000, engagementRate: 6.1, isActive: true, lastSyncAt: new Date() },
      { userId: vip1.id, platform: 'TIKTOK', handle: '@alexlumens', followersCount: 89000, engagementRate: 8.5, isActive: true, lastSyncAt: new Date() },
      { userId: vip1.id, platform: 'INSTAGRAM', handle: '@alex.lumens', followersCount: 31000, engagementRate: 5.2, isActive: true, lastSyncAt: new Date() },
      { userId: expert1.id, platform: 'YOUTUBE', handle: '@YukiCreates', followersCount: 24000, engagementRate: 5.8, isActive: true, lastSyncAt: new Date() },
    ],
  })
  console.log('✅ Comptes sociaux créés')

  // =============================================
  // V3 — COLLABS & ORDERS
  // =============================================
  await prisma.collabRequest.createMany({
    data: [
      { fromUserId: contributor.id, toUserId: artist.id, type: 'SHOUTOUT', status: 'COMPLETED', escrowTokens: 20, message: 'Salut Sophie, un shoutout mutuel ?', response: 'Avec plaisir !', completedAt: new Date('2026-02-01'), rating: 4.5 },
      { fromUserId: vip1.id, toUserId: expert1.id, type: 'CO_CREATE', status: 'ACCEPTED', escrowTokens: 50, message: 'On fait une vidéo ensemble sur l\'IA dans le cinéma ?' },
      { fromUserId: expert1.id, toUserId: artist.id, type: 'GUEST', status: 'PENDING', escrowTokens: 30, message: 'Intervention guest dans ma prochaine vidéo éducative ?' },
      { fromUserId: rookie2.id, toUserId: vip1.id, type: 'AD_EXCHANGE', status: 'REJECTED', escrowTokens: 10, message: 'Échange de pub ?', response: 'Désolé, pas compatible avec ma niche.' },
    ],
  })

  await prisma.videoOrder.create({
    data: {
      clientUserId: contributor.id,
      creatorUserId: artist.id,
      title: 'Vidéo promo mon portfolio',
      description: 'Vidéo de 30 sec pour présenter mon portfolio de prompt engineer.',
      style: 'Cinématique, professionnel',
      duration: 30,
      deadline: new Date('2026-03-01'),
      priceTokens: 50,
      status: 'IN_PROGRESS',
      revisionCount: 0,
      maxRevisions: 2,
    },
  })

  await prisma.videoOrder.create({
    data: {
      clientUserId: viewer.id,
      title: 'Intro YouTube custom',
      description: 'Une intro animée de 5 secondes avec mon logo et un effet gold cinéma.',
      style: 'Luxe, doré, cinéma',
      duration: 5,
      deadline: new Date('2026-03-15'),
      priceTokens: 25,
      status: 'OPEN',
      maxRevisions: 1,
    },
  })

  await prisma.videoOrder.create({
    data: {
      clientUserId: expert1.id,
      creatorUserId: vip1.id,
      title: 'Animation explainer science',
      description: 'Animation de 60 sec expliquant le concept de machine learning pour ma chaîne.',
      style: 'Éducatif, coloré, dynamique',
      duration: 60,
      deadline: new Date('2026-02-28'),
      priceTokens: 80,
      status: 'DELIVERED',
      deliveryUrl: 'https://example.com/delivery/ml-explainer.mp4',
      revisionCount: 1,
      maxRevisions: 2,
    },
  })

  console.log('✅ Collabs et commandes créées')

  // =============================================
  // V3 — REFERRALS
  // =============================================
  // VIP referred contributor
  await prisma.user.update({
    where: { id: vip1.id },
    data: { referralCode: 'ALEX-VIP-2026' },
  })

  await prisma.user.update({
    where: { id: artist.id },
    data: { referralCode: 'SOPHIE-ART' },
  })

  await prisma.referral.create({
    data: {
      referrerId: vip1.id,
      referredId: rookie2.id,
      tokensEarned: 30,
      status: 'COMPLETED',
      completedAt: new Date('2026-01-10'),
    },
  })

  await prisma.referral.create({
    data: {
      referrerId: artist.id,
      referredId: viewer.id,
      tokensEarned: 30,
      status: 'COMPLETED',
      completedAt: new Date('2026-01-20'),
    },
  })

  console.log('✅ Parrainages créés')

  // =============================================
  // V3 — REPUTATION EVENTS
  // =============================================
  const repEvents = [
    { userId: artist.id, type: 'deadline_met', score: 5, weight: 1.0, source: 'STUDIO' as const },
    { userId: artist.id, type: 'quality_high', score: 8, weight: 1.0, source: 'STUDIO' as const },
    { userId: artist.id, type: 'collab_completed', score: 4, weight: 1.0, source: 'COLLABS' as const },
    { userId: vip1.id, type: 'deadline_met', score: 5, weight: 1.0, source: 'STUDIO' as const },
    { userId: vip1.id, type: 'quality_high', score: 10, weight: 1.0, source: 'STUDIO' as const },
    { userId: vip1.id, type: 'engagement_high', score: 7, weight: 1.0, source: 'CREATOR' as const },
    { userId: vip1.id, type: 'collab_completed', score: 5, weight: 1.0, source: 'COLLABS' as const },
    { userId: expert1.id, type: 'deadline_met', score: 5, weight: 1.0, source: 'STUDIO' as const },
    { userId: expert1.id, type: 'quality_high', score: 9, weight: 1.0, source: 'STUDIO' as const },
    { userId: contributor.id, type: 'deadline_met', score: 4, weight: 1.0, source: 'STUDIO' as const },
    { userId: contributor.id, type: 'collab_completed', score: 3, weight: 1.0, source: 'COLLABS' as const },
  ]

  for (const re of repEvents) {
    await prisma.reputationEvent.create({ data: re })
  }

  // Update reputation scores
  await prisma.user.update({ where: { id: artist.id }, data: { reputationScore: 72, reputationBadge: 'gold' } })
  await prisma.user.update({ where: { id: vip1.id }, data: { reputationScore: 88, reputationBadge: 'platinum' } })
  await prisma.user.update({ where: { id: expert1.id }, data: { reputationScore: 75, reputationBadge: 'gold' } })
  await prisma.user.update({ where: { id: contributor.id }, data: { reputationScore: 55, reputationBadge: 'silver' } })

  console.log('✅ Événements de réputation créés')

  // =============================================
  // V3 — ADDITIONAL LUMEN TRANSACTIONS (new types)
  // =============================================
  const v3Txs = [
    { userId: artist.id, amount: -10, type: 'VIDEO_GEN', description: 'Génération vidéo — Comment l\'IA révolutionne le design' },
    { userId: artist.id, amount: -15, type: 'VIDEO_GEN', description: 'Génération vidéo 4K — 5 tendances visuelles 2026' },
    { userId: vip1.id, amount: -18, type: 'VIDEO_GEN', description: 'Génération vidéo — L\'affaire du manoir abandonné' },
    { userId: vip1.id, amount: -8, type: 'AB_TEST', description: 'A/B Test — Variante B du manoir' },
    { userId: vip1.id, amount: -5, type: 'PUBLISH', description: 'Publication multi-plateforme (3 réseaux)' },
    { userId: artist.id, amount: -5, type: 'PUBLISH', description: 'Publication TikTok + Instagram' },
    { userId: contributor.id, amount: -3, type: 'OUTREACH', description: 'Outreach — Contact Sophie pour collab' },
    { userId: expert1.id, amount: -10, type: 'VIDEO_GEN', description: 'Génération vidéo — Physique quantique' },
  ]

  for (const tx of v3Txs) {
    await prisma.lumenTransaction.create({ data: tx as any })
  }
  console.log('✅ Transactions V3 créées')

  // =============================================
  // CONTENT HASHES
  // =============================================
  await prisma.contentHash.createMany({
    data: [
      { entityType: 'TaskSubmission', entityId: 'sub-1', hash: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2', algorithm: 'SHA-256', createdById: contributor.id },
      { entityType: 'TaskSubmission', entityId: 'sub-2', hash: 'f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5', algorithm: 'SHA-256', createdById: vip1.id },
    ],
  })
  console.log('✅ Content hashes créés')

  // =============================================
  // SUMMARY
  // =============================================
  console.log('\n' + '='.repeat(50))
  console.log('🎬 Seed Lumière Brothers V3 terminé avec succès!')
  console.log('='.repeat(50))
  console.log('\n📋 Comptes de test:')
  console.log('   Admin       : admin@lumiere.film         / Admin1234!')
  console.log('   Contributeur: contributeur@lumiere.film  / Test1234!')
  console.log('   Artiste     : artiste@lumiere.film       / Test1234!  (créateur, Pro)')
  console.log('   Scénariste  : scenariste@lumiere.film    / Test1234!')
  console.log('   Stunt       : stunt@lumiere.film         / Test1234!')
  console.log('   Viewer      : viewer@lumiere.film        / Test1234!')
  console.log('   Rookie      : nouveau@lumiere.film       / Test1234! (non vérifié)')
  console.log('   Rookie 2    : thomas@lumiere.film        / Test1234!')
  console.log('   Expert      : expert@lumiere.film        / Test1234!  (créateur, Starter)')
  console.log('   VIP         : vip@lumiere.film           / Test1234!  (créateur, Business)')
  console.log('\n🎞️  Films Studio:')
  console.log('   - Exodus — La Traversée (Historique, IN_PRODUCTION)')
  console.log('   - Neon Babylon (Sci-Fi, PRE_PRODUCTION)')
  console.log('   - Le Dernier Jardin (Animation, DRAFT)')
  console.log('\n📺 Streaming Catalogue:')
  console.log('   - Ombres de Tokyo (Thriller, LIVE, 3420 vues)')
  console.log('   - Rêve Électrique (Sci-Fi, LIVE, 5890 vues)')
  console.log('   - Mémoires d\'Eau (Documentaire, PENDING)')
  console.log('\n🎥 Profils Créateurs: 3 (SophieViz, AlexLumens, YukiCreates)')
  console.log('   - 5 vidéos générées, 6 plannings de publication')
  console.log('\n🤝 Collabs: 4 demandes, 3 commandes vidéo')
  console.log('👥 Parrainages: 2 (VIP→Rookie2, Artiste→Viewer)')
  console.log('⭐ Réputation: 11 événements, 4 utilisateurs avec scores')
  console.log('\n💰 Aides publiques: 8 (BPI, CNC, CIR, RIAM, JEI, i-Nov, NACRE, ACRE)')
  console.log('\n🚀 Pour démarrer: npm run dev')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
