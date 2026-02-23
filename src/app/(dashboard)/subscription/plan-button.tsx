'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

function WaitlistToast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-white border border-[#D4AF37]/20 shadow-lg">
        <div className="h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse" />
        <p className="text-sm text-gray-700">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
        >
          &times;
        </button>
      </div>
    </div>
  )
}

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
  const [showToast, setShowToast] = useState(false)

  if (isCurrent) {
    return (
      <Button disabled variant="secondary" className="w-full min-h-[44px]">
        Plan actuel
      </Button>
    )
  }

  return (
    <>
      <Button
        variant={isRecommended ? 'default' : 'outline'}
        className={`w-full min-h-[44px] ${isRecommended ? 'bg-[#D4AF37] text-white hover:bg-[#C5A028] font-semibold' : ''}`}
        onClick={() => {
          setShowToast(true)
          setTimeout(() => setShowToast(false), 4000)
        }}
      >
        {isFree ? 'Downgrader' : 'Choisir'}
      </Button>
      {showToast && (
        <WaitlistToast
          message="Paiements bientot disponibles — Rejoignez la liste d'attente !"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  )
}

export function TokenPackButton({
  isBestValue,
}: {
  isBestValue: boolean
}) {
  const [showToast, setShowToast] = useState(false)

  return (
    <>
      <button
        onClick={() => {
          setShowToast(true)
          setTimeout(() => setShowToast(false), 4000)
        }}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 min-h-[44px] cursor-pointer ${
          isBestValue
            ? 'bg-[#D4AF37] text-white hover:bg-[#C5A028]'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Acheter
      </button>
      {showToast && (
        <WaitlistToast
          message="Paiements bientot disponibles — Rejoignez la liste d'attente !"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  )
}
