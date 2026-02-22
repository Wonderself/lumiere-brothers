'use client'

import { Button } from '@/components/ui/button'

export function PlanButton({
  planId,
  planName,
  isCurrent,
  isRecommended,
  isFree,
}: {
  planId: string
  planName: string
  isCurrent: boolean
  isRecommended: boolean
  isFree: boolean
}) {
  if (isCurrent) {
    return (
      <Button disabled variant="secondary" className="w-full">
        Plan actuel
      </Button>
    )
  }

  return (
    <Button
      variant={isRecommended ? 'default' : 'outline'}
      className="w-full"
      onClick={() => {
        alert(`L'abonnement ${planName} sera bientot disponible. Restez connecte !`)
      }}
    >
      {isFree ? 'Downgrader' : 'Choisir'}
    </Button>
  )
}
