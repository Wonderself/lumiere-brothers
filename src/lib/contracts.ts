/**
 * Auto-generated contracts for film creators
 * Markdown template with variable substitution
 */

export function generateFilmContract(params: {
  creatorName: string
  filmTitle: string
  revenueSharePct: number
  exclusivity: boolean
  exclusivityBonus: number
  signDate: string
}): string {
  const { creatorName, filmTitle, revenueSharePct, exclusivity, exclusivityBonus, signDate } = params
  const totalShare = exclusivity ? revenueSharePct + exclusivityBonus : revenueSharePct

  return `# CONTRAT DE DISTRIBUTION — LUMIÈRE BROTHERS

**Date :** ${signDate}

---

## ENTRE LES PARTIES

**Le Créateur :** ${creatorName}

**La Plateforme :** Lumière Brothers SAS (ci-après "LB")

---

## ARTICLE 1 — OBJET

Le présent contrat porte sur la distribution du film **"${filmTitle}"** (ci-après "l'Œuvre") sur la plateforme Lumière Brothers.

## ARTICLE 2 — DROITS CONCÉDÉS

Le Créateur accorde à LB le droit non-exclusif${exclusivity ? ' **EXCLUSIF**' : ''} de diffuser l'Œuvre sur sa plateforme de streaming pour une durée de **12 mois renouvelable**.

${exclusivity ? `> **Clause d'exclusivité active** : Le Créateur s'engage à ne pas diffuser l'Œuvre sur d'autres plateformes de streaming pendant la durée du contrat. En contrepartie, un bonus de +${exclusivityBonus}% est appliqué au partage de revenus.\n` : ''}

## ARTICLE 3 — RÉMUNÉRATION

- **Part du Créateur :** ${totalShare}% des revenus générés par les vues de l'Œuvre
${exclusivity ? `  - Part de base : ${revenueSharePct}% + Bonus exclusivité : ${exclusivityBonus}%\n` : ''}
- **Part Plateforme :** ${100 - totalShare}%
- **Calcul :** Ratio = (vues du film / vues totales plateforme) × pool mensuel de revenus
- **Paiement :** Virement mensuel, dans les 15 jours suivant la fin de chaque mois calendaire
- **Minimum :** Aucun paiement si le montant est inférieur à 10€ (reporté au mois suivant)

## ARTICLE 4 — PROMOTION

Le Créateur s'engage à :
- Partager le lien de l'Œuvre sur ses réseaux sociaux **au minimum 1 fois par mois**
- Mentionner "Disponible sur Lumière Brothers" dans ses communications relatives à l'Œuvre
- Ne pas dénigrer la plateforme publiquement

## ARTICLE 5 — GARANTIES DU CRÉATEUR

Le Créateur garantit :
- Être le titulaire légitime des droits sur l'Œuvre
- Que l'Œuvre ne viole aucun droit de tiers (droits d'auteur, droit à l'image, etc.)
- Que l'Œuvre ne contient aucun contenu illicite

## ARTICLE 6 — RÉSILIATION

- Résiliation par le Créateur : préavis de **30 jours**, l'Œuvre reste disponible pendant le préavis
- Résiliation par LB : en cas de violation du contrat, avec préavis de **15 jours**
- En cas de résiliation, les revenus dus restent payables

## ARTICLE 7 — DONNÉES & TRANSPARENCE

LB s'engage à fournir au Créateur un accès en temps réel à :
- Nombre de vues (total et par mois)
- Revenus générés et à venir
- Position dans le catalogue

## ARTICLE 8 — LOI APPLICABLE

Le présent contrat est régi par le droit français. Tout litige sera soumis aux tribunaux compétents de Paris.

---

**Signature électronique :** En cliquant "J'accepte", le Créateur reconnaît avoir lu et accepté l'ensemble des termes du présent contrat.

*Document généré automatiquement par Lumière Brothers le ${signDate}.*
`
}
