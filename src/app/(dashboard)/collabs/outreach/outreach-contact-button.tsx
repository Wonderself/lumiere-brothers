'use client'

import { Send } from 'lucide-react'
import { useActionState } from 'react'
import { outreachContactAction } from '@/app/actions/collabs'

export function OutreachContactButton({
  suggestionId,
  suggestionName,
  cost,
  balance,
}: {
  suggestionId: string
  suggestionName: string
  cost: number
  balance: number
}) {
  const [state, formAction, isPending] = useActionState(outreachContactAction, null)

  const insufficient = balance < cost

  return (
    <div>
      <form action={(formData) => {
        if (insufficient) return
        const confirmed = confirm(
          `Confirmer le contact avec ${suggestionName} ?\n\nCout: ${cost} tokens\nSolde actuel: ${balance} tokens\nSolde apres: ${balance - cost} tokens`
        )
        if (!confirmed) return
        formAction(formData)
      }}>
        <input type="hidden" name="suggestionId" value={suggestionId} />
        <input type="hidden" name="suggestionName" value={suggestionName} />
        <input type="hidden" name="cost" value={cost} />
        <button
          type="submit"
          disabled={insufficient || isPending}
          className={`w-full h-9 rounded-lg text-sm font-semibold transition-all inline-flex items-center justify-center gap-2 ${
            insufficient || isPending
              ? 'bg-white/5 text-white/20 cursor-not-allowed'
              : 'bg-[#D4AF37] text-black hover:bg-[#F0D060] cursor-pointer'
          }`}
        >
          {isPending ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Envoi...
            </>
          ) : (
            <>
              <Send className="h-3.5 w-3.5" />
              Contacter ({cost} tokens)
            </>
          )}
        </button>
      </form>
      {insufficient && (
        <p className="text-red-400/60 text-xs text-center mt-1.5">Solde insuffisant</p>
      )}
      {state?.error && (
        <p className="text-red-400 text-xs text-center mt-1.5">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-green-400 text-xs text-center mt-1.5">Contact envoye !</p>
      )}
    </div>
  )
}
