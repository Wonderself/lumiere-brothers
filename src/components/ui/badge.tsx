import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]',
        secondary: 'border-gray-200 bg-gray-100 text-gray-600',
        destructive: 'border-red-200 bg-red-50 text-red-600',
        success: 'border-green-200 bg-green-50 text-green-600',
        warning: 'border-yellow-200 bg-yellow-50 text-yellow-600',
        outline: 'border-gray-200 text-gray-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
